import { AppDataSource } from "../../db";
import {
  CurrentOrg,
  Organization,
  User,
  userRepository,
  UserType,
} from "../../db/models";
import { AUTH_ERROR } from "../../error";
import { AuthService } from "../../services/auth.service";
import { HashService } from "../../services/hash.service";
import { JwtService } from "../../services/jwt.service";
import { QueueService } from "../../services/queue.service";
import {
  IRegistrationPayload,
  UserAccountEnum,
  UserCurrentOrgRoleEnum,
} from "../../types/auth";
import {
  Conflict,
  ExpectationFailed,
  Unauthorized,
  BadRequest,
} from "http-errors";
import { QueueEnum } from "../../types/queue";
import { generateOTP } from "../../utils";

export class AuthFunctions {
  protected async registerUserByEmail(
    payload: IRegistrationPayload,
  ): Promise<void> {
    //get all the data from body
    const { email, name, phoneNumber, password, account_type, phoneCode } =
      payload;

    //find if any user exists with this email
    const userExist = await this.getUserByEmail(email);
    if (userExist) throw new Conflict(AUTH_ERROR.EMAIL_ALREADY_REGISTERED);

    //hash the password
    const hash = await new HashService().hash(password);

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      //save the user with the hash password
      const user = await transactionalEntityManager.save(User, {
        data: {
          email,
          name,
          phoneNumber,
          password: hash,
          account_type,
          phoneCode,
        },
      });

      if (!user) throw new ExpectationFailed(AUTH_ERROR.USER_NOT_CREATED);

      //save the current organization
      if (account_type === UserAccountEnum.BUSINESS) {
        const organization =
          await transactionalEntityManager.save(Organization);
        if (!organization)
          throw new ExpectationFailed(AUTH_ERROR.ORGANIZATION_NOT_CREATED);

        const currentUserOrg = await transactionalEntityManager.save(
          CurrentOrg,
          {
            data: {
              organization,
              user,
              role: UserCurrentOrgRoleEnum.SUPER_ADMIN,
            },
          },
        );
        if (!currentUserOrg)
          throw new ExpectationFailed(AUTH_ERROR.CURRENT_ORG_NOT_CREATED);
      }
    });

    await this.sendVerificationCode(email);
  }
  protected async getUserByEmail(email: string) {
    return await userRepository.findOneBy({ email });
  }
  protected async loginAndGenerateTokens({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    // validate user login
    const userExist = await this.validateUserLoginByEmail({
      email,
      password,
    });

    //generate refresh token
    const refreshToken = await new AuthService().getRefreshToken({
      id: userExist.id,
      account_type: userExist.account_type,
      currentOrgId: userExist.currentOrg.id,
      currentOrgRole: userExist.currentOrg.role,
      email: userExist.email,
      name: userExist.name,
    });

    //generate access token
    const accessToken = await new AuthService().getAccessToken({
      id: userExist.id,
      account_type: userExist.account_type,
      currentOrgId: userExist.currentOrg.id,
      currentOrgRole: userExist.currentOrg.role,
      email: userExist.email,
      name: userExist.name,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
  protected async validateUserLoginByEmail({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    //check if user exists
    const userExist = await this.getUserByEmail(email);
    if (!userExist) throw new Unauthorized(AUTH_ERROR.INVALID_CREDENTIALS);

    //check if user is blocked
    if (userExist.is_email_verified)
      throw new Unauthorized(AUTH_ERROR.UNVERIFIED_USER);

    //check if user is blocked
    if (userExist.is_blocked) throw new Unauthorized(AUTH_ERROR.ACCESS_BLOCKED);

    //check if user is deleted
    if (userExist.is_deleted) throw new Unauthorized(AUTH_ERROR.ACCESS_BLOCKED);

    //check if user current organization is blocked
    if (userExist.currentOrg.is_blocked)
      throw new Unauthorized(AUTH_ERROR.ACCESS_BLOCKED);

    //check if password is correct
    const isPasswordCorrect = await new HashService().compare(
      password,
      userExist.password,
    );
    if (!isPasswordCorrect)
      throw new Unauthorized(AUTH_ERROR.INVALID_CREDENTIALS);

    return userExist;
  }
  protected async verifyOtp(email: string, otp: string) {
    //find if any user exists with this email
    const userExist = await this.getUserByEmail(email);
    if (!userExist) throw new BadRequest(AUTH_ERROR.USER_NOT_CREATED);
    if (!userExist.verificationInfo)
      throw new BadRequest(AUTH_ERROR.INVALID_AUTH);

    //check if otp is expired
    if (new Date() > userExist.verificationInfo.expiry)
      throw new BadRequest(AUTH_ERROR.OTP_EXPIRED);

    // check if otp is correct
    if (userExist.verificationInfo.otp !== otp)
      throw new BadRequest(AUTH_ERROR.INVALID_OTP);
    return true;
  }
  protected async updateUser(
    email: string,
    values: {
      is_email_verified?: boolean;
      is_deleted?: boolean;
      is_blocked?: boolean;
      is_phone_verified?: boolean;
      password?: string;
    },
  ) {
    await userRepository.update({ email }, values);
    return true;
  }
  protected async sendVerificationCode(email: string) {
    //find if any user exists with this email
    const userExist = await this.getUserByEmail(email);
    if (!userExist) throw new BadRequest(AUTH_ERROR.USER_NOT_CREATED);

    //send verification code to email
    const otp = generateOTP();
    const expiryDate = new Date(new Date().getTime() + 15 * 60 * 1000);
    const user = await userRepository.update(
      { email },
      { verificationInfo: { otp, expiry: expiryDate } },
    );
    if (!user) throw new BadRequest(AUTH_ERROR.INVALID_AUTH);

    //send email
    await new QueueService().sendEmailToQueue({
      message: `Hello ${email}, Your OTP is ${otp}.`,
      subject: "Verify Your Email",
      to: email,
    });
  }
  protected async changeUserPassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    //update password
    const user = await userRepository.update(
      { email },
      { password: await new HashService().hash(password) },
    );
    if (!user) throw new BadRequest(AUTH_ERROR.INVALID_AUTH);

    //send email
    await new QueueService().sendEmailToQueue({
      message: `Hello ${email}, Your Password is changed successfully.`,
      subject: "Password Changed",
      to: email,
    });
  }
}
