import jwt from "jsonwebtoken";

export const generateToken = (payload: any, exp?: string) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: exp ?? (process.env.JWT_EXPIRES_IN as string),
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};