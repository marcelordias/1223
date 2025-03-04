import { Response } from "express";
import {
  ResponseCodeStatusEnum,
  ResponseMessageEnum,
  ResponseStatusEnum,
} from "../enums/response-status.enum";
import { ResponseMessageType } from "../types/response.type";
import { CustomRequestType } from "../types/request.type";
import { secureUser } from "../utils/auth.util";
import { UserType } from "../types/user.type";
import { User } from "../models/user.model";
import { UserInfo } from "os";

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
      user: secureUser(user as unknown as UserType),
    },
  } as ResponseMessageType);
}

export async function getUsers(
  req: CustomRequestType,
  res: Response
): Promise<Response> {
  const rawUsers = await User.find({}).lean().exec();
  const users: UserType[] = rawUsers.map(user => ({
    ...user,
    _id: user._id.toString()
  })) as UserType[];

  const secureUsers = users.map((user: UserType) => secureUser(user));

  return res.status(ResponseCodeStatusEnum.SUCCESS).json({
    status: ResponseStatusEnum.SUCCESS,
    message: ResponseMessageEnum.SUCCESS,
    data: {
      users: secureUsers,
    },
  } as ResponseMessageType);
}
