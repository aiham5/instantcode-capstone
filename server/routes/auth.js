const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");
const passport = require("passport");

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) return res.status(409).json({ error: "User already exists" });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, email, password: hash },
  });
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.json({ token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.json({ token });
});
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET);
    res.redirect(`http://localhost:5173/oauth-redirect?token=${token}`);
  }
);

module.exports = router;
