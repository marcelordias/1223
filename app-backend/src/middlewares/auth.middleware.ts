import { Response, NextFunction } from "express";
import { CustomRequestType } from "../types/request.type";
import { ResponseMessageType } from "../types/response.type";
import {
  ResponseStatusEnum,
  ResponseMessageEnum,
  ResponseCodeStatusEnum,
} from "../enums/response-status.enum";
import { User } from "../models/user.model";
import { UserType } from "../types/user.type";
import { verifyToken } from "../utils/token.util";

export const authMiddleware = (
  req: CustomRequestType,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers["x-api-key"] as string;
  if (!token) {
    return res.status(ResponseCodeStatusEnum.UNAUTHORIZED).json({
      status: ResponseStatusEnum.ERROR,
      message: ResponseMessageEnum.ACCESS_DENIED,
    } as ResponseMessageType);
  }

  token = token.replace("Bearer ", "");

  try {
    const verified = verifyToken(token);

    const { id } = verified as { id: string };

    if (!id) {
      return res.status(ResponseCodeStatusEnum.UNAUTHORIZED).json({
        status: ResponseStatusEnum.ERROR,
        message: ResponseMessageEnum.ACCESS_DENIED,
      } as ResponseMessageType);
    }

    User.findById(id).then((user) => {
      if (!user) {
        return res.status(ResponseCodeStatusEnum.UNAUTHORIZED).json({
          status: ResponseStatusEnum.ERROR,
          message: ResponseMessageEnum.ACCESS_DENIED,
        } as ResponseMessageType);
      }

      req.user = user as unknown as UserType;

      next();
    });
  } catch (error: any) {
    res.status(ResponseCodeStatusEnum.BAD_REQUEST).json({
      status: ResponseStatusEnum.ERROR,
      message: ResponseMessageEnum.INVALID_TOKEN,
    } as ResponseMessageType);
  }
};
