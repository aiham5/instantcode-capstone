const router = require("express").Router();
const prisma = require("../prisma/client");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await prisma.post.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      likes: true,
      comments: {
        select: { id: true },
      },
    },
  });

  const total = await prisma.post.count();

  res.json({ posts, total });
});

router.get("/all", async (req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      likes: true,
      comments: {
        select: { id: true },
      },
    },
  });

  res.json(posts);
});

router.get("/:id", async (req, res) => {
  const postId = parseInt(req.params.id);
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
          likes: true,
        },
      },
      likes: true,
    },
  });
  if (!post) return res.sendStatus(404);
  res.json(post);
});
router.post("/", isLoggedIn, async (req, res) => {
  const { image, caption } = req.body;
  const post = await prisma.post.create({
    data: {
      image,
      caption,
      userId: req.user.id,
    },
  });
  res.status(201).json(post);
});

router.delete("/:id", isLoggedIn, async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!post || post.userId !== req.user.id) return res.sendStatus(403);
  await prisma.post.delete({ where: { id: post.id } });
  res.json({ success: true });
});

router.delete("/admin/:id", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId))
      return res.status(400).json({ error: "Invalid post ID" });

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ error: "Post not found" });

    await prisma.comment.deleteMany({ where: { postId } });
    await prisma.like.deleteMany({ where: { postId } });
    await prisma.report.deleteMany({ where: { postId } });

    await prisma.post.delete({ where: { id: postId } });

    res.json({ success: true });
  } catch (err) {
    console.error("Admin delete error:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

router.post("/", isLoggedIn, async (req, res) => {
  const { image, caption } = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        image,
        caption,
        userId: req.user.id,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { username: true },
    });

    const friends = await prisma.friend.findMany({
      where: { userId: req.user.id },
      select: { addedById: true },
    });
    const notifications = friends.map((friend) =>
      prisma.notification.create({
        data: {
          userId: friend.addedById,
          message: `${user.username} just posted something new.`,
        },
      })
    );

    await Promise.all(notifications);

    res.status(201).json(post);
  } catch (err) {
    console.error("Post creation error:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

module.exports = router;
