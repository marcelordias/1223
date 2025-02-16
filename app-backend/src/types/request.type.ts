import { Request } from "express";
import { UserType } from "./user.type";

export type CustomRequestType = Request & { user?: UserType };