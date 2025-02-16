import { ResponseMessageEnum, ResponseStatusEnum } from "../enums/response-status.enum";

export type ResponseMessageType = {
    status: ResponseStatusEnum;
    message: ResponseMessageEnum;
    data?: any;
};