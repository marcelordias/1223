import { Response } from "express";
import {
  ResponseCodeStatusEnum,
  ResponseMessageEnum,
  ResponseStatusEnum,
} from "../enums/response-status.enum";
import { ResponseMessageType } from "../types/response.type";
import { CustomRequestType } from "../types/request.type";

export async function userInfo(
  req: CustomRequestType,
  res: Response
): Promise<Response> {
  const { user } = req;

  if (!user) {
    return res.status(ResponseCodeStatusEnum.UNAUTHORIZED).json({
      status: ResponseStatusEnum.ERROR,
      message: ResponseMessageEnum.ACCESS_DENIED,
    } as ResponseMessageType);
  }

  return res.status(ResponseCodeStatusEnum.SUCCESS).json({
    status: ResponseStatusEnum.SUCCESS,
    message: ResponseMessageEnum.SUCCESS,
    data: {
      user,
    },
  } as ResponseMessageType);
}
