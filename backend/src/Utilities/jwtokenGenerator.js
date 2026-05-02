import jwt from "jsonwebtoken";
import "dotenv/config";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }

  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production");
  }

  return secret;
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
