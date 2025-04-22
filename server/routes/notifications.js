const router = require("express").Router();
const prisma = require("../prisma/client");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", isLoggedIn, async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(notifications);
});

router.put("/:id/read", isLoggedIn, async (req, res) => {
  await prisma.notification.update({
    where: { id: parseInt(req.params.id) },
    data: { read: true },
  });
  res.json({ success: true });
});

module.exports = router;
