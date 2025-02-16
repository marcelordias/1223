export enum ResponseStatusEnum {
  SUCCESS = "success",
  ERROR = "error",
}

export enum ResponseCodeStatusEnum {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ResponseMessageEnum {
  SUCCESS = "success",
  ERROR = "error",
  USER_NOT_FOUND = "user_not_found",
  USER_ALREADY_EXIST = "user_already_exist",
  ACCESS_DENIED = "access_denied",
  MISSING_REQUIRED_FIELDS = "missing_required_fields",
  SIGNIN_SUCCESS = "signin_success",
  INVALID_TOKEN = "nvalid_token",
  INTERNAL_SERVER_ERROR = "internal_server_error",
}
