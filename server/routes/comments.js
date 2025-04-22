const router = require("express").Router();
const prisma = require("../prisma/client");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

router.post("/", isLoggedIn, async (req, res) => {
  const { postId, content } = req.body;
  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      userId: req.user.id,
    },
    include: {
      user: { select: { id: true, username: true, image: true } },
    },
  });
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (post.userId !== req.user.id) {
    await prisma.notification.create({
      data: {
        userId: post.userId,
        message: `${req.user.username} commented on your post`,
      },
    });
  }

  res.status(201).json(comment);
});

router.delete("/:id", isLoggedIn, async (req, res) => {
  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!comment || comment.userId !== req.user.id) return res.sendStatus(403);
  await prisma.comment.delete({ where: { id: comment.id } });
  res.json({ success: true });
});

router.delete("/admin/:id", isLoggedIn, isAdmin, async (req, res) => {
  await prisma.comment.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true });
});

module.exports = router;
