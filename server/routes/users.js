const router = require("express").Router();
const prisma = require("../prisma/client");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

router.put("/me", isLoggedIn, async (req, res) => {
  const { bio, image } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        bio,
        image: image === "REMOVE_IMAGE" ? null : image,
      },
    });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update profile" });
  }
});

router.put("/:id/remove-image", isLoggedIn, isAdmin, async (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { image: null },
    });
    res.json({ success: true, message: "Profile picture removed" });
  } catch (err) {
    console.error("Remove image error:", err);
    res.status(500).json({ error: "Failed to remove image" });
  }
});

"/me",
  isLoggedIn,
  async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        image: true,
        role: true,
      },
    });
    res.json(user);
  };

router.get("/me", isLoggedIn, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
      image: true,
      role: true,
    },
  });

  if (!user) return res.status(401).json({ error: "User not found" });

  res.json(user);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Check if id is a valid integer
  const idInt = parseInt(id);

  if (isNaN(idInt)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: idInt,
    },
    select: {
      id: true,
      username: true,
      bio: true,
      image: true,
      posts: {
        select: {
          id: true,
          image: true,
          caption: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

router.put("/:id/promote", isLoggedIn, isAdmin, async (req, res) => {
  const user = await prisma.user.update({
    where: { id: parseInt(req.params.id) },
    data: { role: "admin" },
  });
  res.json({ success: true });
});

router.delete("/:id", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (targetUser.role === "admin") {
      return res.status(403).json({ error: "You cannot delete another admin" });
    }

    await prisma.friend.deleteMany({
      where: {
        OR: [{ userId }, { addedById: userId }],
      },
    });

    await prisma.report.deleteMany({ where: { userId } });
    await prisma.comment.deleteMany({ where: { userId } });
    await prisma.like.deleteMany({ where: { userId } });
    await prisma.post.deleteMany({ where: { userId } });
    await prisma.notification.deleteMany({ where: { userId } });

    await prisma.user.delete({ where: { id: userId } });

    res.json({ success: true });
  } catch (err) {
    console.error("User delete error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

router.get("/", isLoggedIn, async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
    },
  });
  res.json(users);
});

module.exports = router;
