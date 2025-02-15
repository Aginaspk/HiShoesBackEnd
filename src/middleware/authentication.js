import jwt from "jsonwebtoken";
import customError from "../utils/customError.js";

// const verifyToken = (req, res, next) => {
//   try {
//     const authHeader = req.header.token;
//     if (!authHeader) {
//       return next(new customError("Authentication token missing", 401));
//     }
//     const token = authHeader.split(" ")[1];
//     if (!token) {
//       return next(new customError("Authentication token not provided", 403));
//     }
//     jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
//       if (err) {
//         console.log("JWT verification errro:", err.message);
//         return next(new customError("invalid or expired token", 403));
//       }
//       req.user = decoded;
//       next();
//     });
//   } catch (error) {
//     console.log("Token verification errro:", err.message);
//     next(new customError("failed to verify token", 500));
//   }
// };


// const verifyToken = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization || req.headers.Authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return next(new customError("Authentication token missing", 401));
//     }

//     const token = authHeader.split(" ")[1];

//     jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
//       if (err) {
//         console.log("JWT verification error:", err.message);
//         return next(new customError("Invalid or expired token", 403));
//       }
//       req.user = decoded;
//       next();
//     });
//   } catch (error) {
//     console.log("Token verification error:", error.message);
//     next(new customError("Failed to verify token", 500));
//   }
// };

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token; 

    if (!token) {
      return next(new customError("Authentication token missing", 401));
    }

    jwt.verify(token, process.env.JWT_TOKEN_USER, (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err.message);
        return next(new customError("Invalid or expired token", 403));
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Token verification error:", error.message);
    next(new customError("Failed to verify token", 500));
  }
};


const veridyAdminToken = (req, res, next) => {
  try {
    if (!req.user) {
      return next(new customError("Auth failed", 401));
    }

    if (!req.user.isAdmin) {
      return next(new customError("Access denied", 403));
    }

    next();
  } catch (error) {
    console.log("Admin verifiacton Error", error.message);
    next(new customError("failed to verify admin", 500));
  }
};

export { verifyToken, veridyAdminToken };
