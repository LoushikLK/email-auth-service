import { UserType } from "../db/models";

export enum UserAccountEnum {
  PERSONAL = "personal",
  BUSINESS = "business",
}

export enum UserCurrentOrgRoleEnum {
  ADMIN = "admin",
  MEMBER = "member",
  SUPER_ADMIN = "super_admin",
}

export interface IRegistrationPayload {
  name: string;
  email: string;
  phoneNumber: string;
  phoneCode: string;
  password: string;
  account_type: UserAccountEnum;
}
