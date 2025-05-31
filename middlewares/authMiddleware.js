const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(403).send("Unauthorized");
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).send("Invalid Token");
  }
};

module.exports=auth;
