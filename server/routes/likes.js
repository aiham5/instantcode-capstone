const router = require("express").Router();
const prisma = require("../prisma/client");
const isLoggedIn = require("../middleware/isLoggedIn");

router.post("/", isLoggedIn, async (req, res) => {
  const { postId, commentId } = req.body;
  const existing = await prisma.like.findFirst({
    where: {
      userId: req.user.id,
      postId: postId || undefined,
      commentId: commentId || undefined,
    },
  });
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return res.json({ liked: false });
  }
  const like = await prisma.like.create({
    data: {
      userId: req.user.id,
      postId: postId || undefined,
      commentId: commentId || undefined,
    },
  });
  if (postId) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (post.userId !== req.user.id) {
      await prisma.notification.create({
        data: {
          userId: post.userId,
          message: `${req.user.username} liked your post`,
        },
      });
    }
  }

  res.status(201).json({ liked: true });
});

module.exports = router;
