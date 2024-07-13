import { AppDataSource } from "../../db";
import {
  CurrentOrg,
  Organization,
  User,
  userRepository,
} from "../../db/models";
import { AUTH_ERROR } from "../../error";
import { HashService } from "../../services/hash.service";
import {
  IRegistrationPayload,
  UserAccountEnum,
  UserCurrentOrgRoleEnum,
} from "../../types/auth";
import { Conflict, ExpectationFailed } from "http-errors";

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
  }
  protected async getUserByEmail(email: string) {
    return await userRepository.findOneBy({ email });
  }
}
