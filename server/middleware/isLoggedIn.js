const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.sendStatus(401);
    req.user = user;
    next();
  } catch {
    res.sendStatus(403);
  }
};
