const router = require("express").Router();
const prisma = require("../prisma/client");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

router.post("/", isLoggedIn, async (req, res) => {
  const { postId, reason } = req.body;
  const report = await prisma.report.create({
    data: {
      postId,
      userId: req.user.id,
      reason,
    },
  });
  res.status(201).json(report);
});

router.get("/", isLoggedIn, isAdmin, async (req, res) => {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        select: {
          id: true,
          caption: true,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
  res.json(reports);
});

module.exports = router;
