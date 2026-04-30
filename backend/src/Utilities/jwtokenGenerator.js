import jwt from "jsonwebtoken";
import "dotenv/config";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET;

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production");
  }

  return secret || "dev-secret-change-me";
};

const generateToken = (payload, time = "7d") => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: time,
    issuer: "CONCH",
  });
};

const verifyToken = (token) => {
  const decoded = jwt.verify(token, getJwtSecret(), {
    issuer: "CONCH",
  });

  return { type: "SUCCESS", data: decoded };
};

export { generateToken, verifyToken };
