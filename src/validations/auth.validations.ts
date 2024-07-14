import { NextFunction, Request, Response } from "express";
import { ValidationChain, body } from "express-validator";
import { validateRequestParams } from "../utils";

const validateRegistration = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validations: ValidationChain[] = [
      body("email")
        .notEmpty()
        .withMessage("email is required.")
        .trim()
        .isEmail()
        .withMessage("provide a valid email."),
      body("name")
        .notEmpty()
        .withMessage("name is required.")
        .isString()
        .withMessage("provide a valid name."),
      body("phoneNumber")
        .optional()
        .isMobilePhone(["en-IN", "en-US"])
        .withMessage("enter a valid mobile number."),
      body("phoneCode")
        .optional()
        .isNumeric()
        .withMessage("enter a valid country code."),
      body("password")
        .notEmpty()
        .withMessage("password is required.")
        .isStrongPassword({
          minLength: 6,
          minLowercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          minUppercase: 1,
        })
        .withMessage(
          "Enter a strong password that contains a minimum 1 lowercase, 1 uppercase, 1 number, 1 symbol.",
        ),
      body("confirmPassword")
        .notEmpty()
        .withMessage("confirmPassword is required.")
        .custom((value, { req }) => {
          if (value !== req?.body?.password) return false;
          return true;
        })
        .withMessage("Password and confirmPassword must match."),
    ];

    await validateRequestParams(validations, req, res, next);
  };
};
const validateEmailVerify = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validations: ValidationChain[] = [
      body("otp")
        .notEmpty()
        .withMessage("otp is required.")
        .trim()
        .isNumeric()
        .withMessage("provide a valid otp."),
      body("email")
        .notEmpty()
        .withMessage("email is required.")
        .trim()
        .isEmail()
        .withMessage("provide a valid email."),
    ];

    await validateRequestParams(validations, req, res, next);
  };
};
const validateResendVerificationCode = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validations: ValidationChain[] = [
      body("email")
        .notEmpty()
        .trim()
        .isEmail()
        .withMessage("provide a valid email."),
    ];

    await validateRequestParams(validations, req, res, next);
  };
};
const validateEmailLogin = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validations: ValidationChain[] = [
      body("email")
        .notEmpty()
        .withMessage("Provide a valid email.")
        .isEmail()
        .withMessage("provide a valid email."),
      body("password").notEmpty().withMessage("Provide a valid password."),
    ];

    await validateRequestParams(validations, req, res, next);
  };
};
const validateChangePassword = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validations: ValidationChain[] = [
      body("email")
        .notEmpty()
        .withMessage("Provide a valid email.")
        .isEmail()
        .withMessage("provide a valid email."),
      body("password").notEmpty().withMessage("Provide a valid password."),
      body("newPassword")
        .notEmpty()
        .withMessage("Provide a valid newPassword.")
        .custom((value, { req }) => {
          if (value !== req?.body?.password) {
            return false;
          }
          return true;
        })
        .withMessage("Password and newPassword must match."),
    ];

    await validateRequestParams(validations, req, res, next);
  };
};
const validateForgotPassword = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validations: ValidationChain[] = [
      body("email")
        .notEmpty()
        .withMessage("email is required.")
        .trim()
        .isEmail()
        .withMessage("provide a valid email."),
    ];

    await validateRequestParams(validations, req, res, next);
  };
};
const validateForgotPasswordOTPVerify = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validations: ValidationChain[] = [
      body("email")
        .notEmpty()
        .withMessage("email is required.")
        .trim()
        .isEmail()
        .withMessage("provide a valid email."),
      body("newPassword")
        .notEmpty()
        .withMessage("newPassword is required.")
        .isStrongPassword({
          minLength: 6,
          minLowercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          minUppercase: 1,
        })
        .withMessage(
          "Enter a strong password that contains a minimum 1 lowercase, 1 uppercase, 1 number, 1 symbol.",
        ),
      body("confirmPassword")
        .notEmpty()
        .withMessage("confirmPassword is required.")
        .custom((value, { req }) => {
          if (value !== req?.body?.newPassword) return false;
          return true;
        })
        .withMessage("newPassword and confirmPassword must match."),
      body("otp")
        .notEmpty()
        .withMessage("otp is required.")
        .isNumeric()
        .withMessage("otp is invalid.")
        .toInt(),
    ];

    await validateRequestParams(validations, req, res, next);
  };
};

export {
  validateChangePassword,
  validateEmailLogin,
  validateRegistration,
  validateEmailVerify,
  validateForgotPassword,
  validateForgotPasswordOTPVerify,
  validateResendVerificationCode,
};
