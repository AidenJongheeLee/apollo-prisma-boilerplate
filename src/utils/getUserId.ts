import jwt from "jsonwebtoken";

interface DecodedUserId {
  userId: string;
}
type Decoded = string | DecodedUserId;

export const getUserId = (request, requireAuth = true) => {
  const header = request.req.headers.authorization;
  if (header) {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as Decoded;
    return typeof decoded === "string" ? decoded : decoded.userId;
  }
  if (requireAuth) throw new Error("Authentication required");

  return null;
};
