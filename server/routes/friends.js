const router = require("express").Router();
const prisma = require("../prisma/client");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", isLoggedIn, async (req, res) => {
  const friends = await prisma.friend.findMany({
    where: { addedById: req.user.id },
    include: {
      user: { select: { id: true, username: true, image: true } },
    },
  });
  res.json(friends.map((f) => f.user));
});

router.post("/", isLoggedIn, async (req, res) => {
  const { userId } = req.body;
  if (userId === req.user.id)
    return res.status(400).json({ error: "Cannot add yourself" });
  const existing = await prisma.friend.findFirst({
    where: {
      userId,
      addedById: req.user.id,
    },
  });
  if (existing) return res.status(409).json({ error: "Already added" });
  await prisma.friend.create({
    data: {
      userId,
      addedById: req.user.id,
    },
  });
  res.status(201).json({ success: true });
});

router.delete("/:userId", isLoggedIn, async (req, res) => {
  const friend = await prisma.friend.findFirst({
    where: {
      userId: parseInt(req.params.userId),
      addedById: req.user.id,
    },
  });
  if (!friend) return res.sendStatus(404);
  await prisma.friend.delete({ where: { id: friend.id } });
  res.json({ success: true });
});

module.exports = router;
