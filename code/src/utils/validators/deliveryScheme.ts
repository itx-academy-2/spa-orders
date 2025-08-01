import { z } from "zod";

import { deliveryMethodValues } from "@/constants/deliveryMethods";

const DeliveryMethod = z.enum(deliveryMethodValues);

export const PostAddressValidationScheme = z.object({
  deliveryMethod: DeliveryMethod.default(deliveryMethodValues[0]),
  city: z
    .string()
    .min(2, { message: "deliveryForm.validation.city.short" })
    .max(100, { message: "deliveryForm.validation.city.long" }),
  department: z
    .string()
    .min(1, { message: "deliveryForm.validation.department.short" })
    .max(100, { message: "deliveryForm.validation.department.long" }),
  firstName: z
    .string()
    .min(2, { message: "deliveryForm.validation.firstName.short" })
    .max(50, { message: "deliveryForm.validation.firstName.long" })
    .regex(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄ'’]+$/, {
      message: "deliveryForm.validation.firstName.invalidCharacters"
    }),
  lastName: z
    .string()
    .min(2, { message: "deliveryForm.validation.lastName.short" })
    .max(50, { message: "deliveryForm.validation.lastName.long" })
    .regex(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄ'’]+$/, {
      message: "deliveryForm.validation.lastName.invalidCharacters"
    }),
  phone: z
    .string()
    .min(10, { message: "deliveryForm.validation.phone.short" })
    .max(13, { message: "deliveryForm.validation.phone.long" })
    .regex(/^\+?[0-9]{10,13}$/, {
      message: "deliveryForm.validation.phone.invalidCharacters"
    }),
  title: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .max(50, { message: "deliveryForm.validation.title.long" })
      .regex(
        /^(?!\s*$)[a-zA-Zа-яА-ЯёЁіІїЇєЄ0-9_\-’']+( [a-zA-Zа-яА-ЯёЁіІїЇєЄ0-9_\-’']+)*$/,
        {
          message: "deliveryForm.validation.title.invalidCharacters"
        }
      )
      .optional()
  )
});
