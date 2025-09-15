// backend/middleware/auth.js


// import jwt from "jsonwebtoken";

// export const authMiddleware = (req, res, next) => {
//   try {
//     const token = req.cookies?.token;
//     if (!token) return res.status(401).json({ message: "Not authenticated" });

//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = { id: payload.id, role: payload.role };
//     return next();
//   } catch (err) {
//     console.warn("authMiddleware failed:", err?.message || err);
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };


// ****************** AUTH UPDATED ***********************

// backend/middleware/auth.js
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (err) {
    console.warn("authMiddleware failed:", err?.message || err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
