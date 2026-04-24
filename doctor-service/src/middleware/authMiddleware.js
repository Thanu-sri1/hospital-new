const jwt = require("jsonwebtoken");

const authMiddleware = (allowedRoles = []) => (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  const token = authHeader.split(" ")[1];
  const candidateSecrets = [
    { secret: process.env.JWT_SECRET_DOCTOR, role: "DOCTOR" },
    { secret: process.env.JWT_SECRET_ADMIN, role: "ADMIN" }
  ].filter((item) => item.secret);

  for (const candidate of candidateSecrets) {
    try {
      const decoded = jwt.verify(token, candidate.secret);
      req.user = decoded;

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "You are not authorized to access this resource" });
      }

      return next();
    } catch (error) {
      continue;
    }
  }

  return res.status(401).json({ message: "Invalid or expired token" });
};

module.exports = authMiddleware;
