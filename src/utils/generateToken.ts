import jwt from "jsonwebtoken";

export const generateToken: (userId: string) => string = userId => {
  return jwt.sign(userId, process.env.JWT_SECRET);
};
