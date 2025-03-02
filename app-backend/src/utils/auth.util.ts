import { UserType } from "../types/user.type";

export function secureUser(user: UserType): UserType {
  const { password, ...secureUser } = user;
  return secureUser;
}
