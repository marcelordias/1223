import { Request, Response } from "express";
import {
  ResponseCodeStatusEnum,
  ResponseMessageEnum,
  ResponseStatusEnum,
} from "../enums/response-status.enum";
import { ResponseMessageType } from "../types/response.type";
import { User } from "../models/user.model";
import { UserType } from "../types/user.type";
import { generateToken } from "../utils/token.util";
import { comparePassword, hashPassword } from "../utils/password.util";

export async function login(req: Request, res: Response): Promise<Response> {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(ResponseCodeStatusEnum.BAD_REQUEST).json({
      status: ResponseStatusEnum.ERROR,
      message: ResponseMessageEnum.MISSING_REQUIRED_FIELDS,
    } as ResponseMessageType);
  }

  try {
    const user = await User.findOne({ username }).lean().exec();

    if (!user) {
      return res.status(ResponseCodeStatusEnum.SUCCESS).json({
        status: ResponseStatusEnum.ERROR,
        message: ResponseMessageEnum.USER_NOT_FOUND,
      } as ResponseMessageType);
    }

    if (!(await comparePassword(password, user.password))) {
      return res.status(ResponseCodeStatusEnum.SUCCESS).json({
        status: ResponseStatusEnum.ERROR,
        message: ResponseMessageEnum.USER_NOT_FOUND,
      } as ResponseMessageType);
    }

    const token = generateToken({ id: user._id });

    return res.status(ResponseCodeStatusEnum.SUCCESS).json({
      status: ResponseStatusEnum.SUCCESS,
      message: ResponseMessageEnum.SIGNIN_SUCCESS,
      data: {
        token,
        user: user as unknown as UserType,
      },
    } as ResponseMessageType);
  } catch (error) {
    console.error(error);
    return res.status(ResponseCodeStatusEnum.INTERNAL_SERVER_ERROR).json({
      status: ResponseStatusEnum.ERROR,
      message: ResponseMessageEnum.INTERNAL_SERVER_ERROR,
    } as ResponseMessageType);
  }
}

export async function register(req: Request, res: Response): Promise<Response> {
  let requestData: UserType = req.body;

  if (!requestData.username || !requestData.password) {
    return res.status(ResponseCodeStatusEnum.BAD_REQUEST).json({
      status: ResponseStatusEnum.ERROR,
      message: ResponseMessageEnum.MISSING_REQUIRED_FIELDS,
    } as ResponseMessageType);
  }

  try {
    const user = await User.findOne({ username: requestData.username })
      .lean()
      .exec();

    if (user) {
      return res.status(ResponseCodeStatusEnum.CONFLICT).json({
        status: ResponseStatusEnum.ERROR,
        message: ResponseMessageEnum.USER_ALREADY_EXIST,
      } as ResponseMessageType);
    }

    requestData.password = await hashPassword(requestData.password);

    const createdData = await User.create(requestData);

    const token = generateToken({ id: createdData._id });

    return res.status(ResponseCodeStatusEnum.SUCCESS).json({
      status: ResponseStatusEnum.SUCCESS,
      message: ResponseMessageEnum.SUCCESS,
      data: {
        token,
        user: createdData as unknown as UserType,
      },
    } as ResponseMessageType);
  } catch (error) {
    console.error(error);
    return res.status(ResponseCodeStatusEnum.INTERNAL_SERVER_ERROR).json({
      status: ResponseStatusEnum.ERROR,
      message: ResponseMessageEnum.INTERNAL_SERVER_ERROR,
    } as ResponseMessageType);
  }
}
