import { z } from "zod";

export const PersonalInfoValidationScheme = z.object({
  firstName: z
    .string()
    .min(2, { message: "personalInfo.validation.firstName.tooShort" })
    .max(50, { message: "personalInfo.validation.firstName.tooLong" })
    .regex(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄ'’-]+$/, {
      message: "Latin, Cyrillic, ', - allowed"
    }),
  lastName: z
    .string()
    .min(2, { message: "personalInfo.validation.lastName.tooShort" })
    .max(50, { message: "personalInfo.validation.lastName.tooLong" })
    .regex(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄ'’-]+$/, {
      message: "Latin, Cyrillic, ', - allowed"
    }),
  phone: z
    .string()
    .transform((val) => (val.trim() === "" ? null : val))
    .nullable()
    .refine((val) => val === null || /^\+?[0-9]{10,13}$/.test(val), {
      message: "personalInfo.validation.phone"
    })
});

export type PersonalInfoValidatorType = z.infer<
  typeof PersonalInfoValidationScheme
>;
