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

    const { _id } = verified as { _id: string };

    if (!_id) {
      return res.status(ResponseCodeStatusEnum.UNAUTHORIZED).json({
        status: ResponseStatusEnum.ERROR,
        message: ResponseMessageEnum.ACCESS_DENIED,
      } as ResponseMessageType);
    }

    User.findById(_id)
      .lean()
      .exec()
      .then((user) => {
      if (!user) {
        return res.status(ResponseCodeStatusEnum.UNAUTHORIZED).json({
        status: ResponseStatusEnum.ERROR,
        message: ResponseMessageEnum.ACCESS_DENIED,
        } as ResponseMessageType);
      }

      const { _id, ...userData } = user;
      const userObject: UserType = {
        _id: _id.toString(),
        ...userData,
      };

      req.user = userObject;
      next();
      })
      .catch((error) => {
      return res.status(ResponseCodeStatusEnum.UNAUTHORIZED).json({
        status: ResponseStatusEnum.ERROR,
        message: ResponseMessageEnum.ACCESS_DENIED,
      } as ResponseMessageType);
      });
  } catch (error: any) {
    res.status(ResponseCodeStatusEnum.BAD_REQUEST).json({
      status: ResponseStatusEnum.ERROR,
      message: ResponseMessageEnum.INVALID_TOKEN,
    } as ResponseMessageType);
  }
};
