import { z } from "zod";

export const AddLinkValidationSchema = z
  .object({
    photoURL: z
      .string()
      .trim()
      .min(1, { message: "addLink.error.required" })
      .url({ message: "addLink.error.invalidUrl" })
      .refine(
        (value) => {
          try {
            const protocol = new URL(value).protocol;
            return protocol === "http:" || protocol === "https:";
          } catch {
            return false;
          }
        },
        { message: "addLink.error.invalidUrl" }
      )
  })
  .strict();

export type AddLinkValidatorType = z.infer<typeof AddLinkValidationSchema>;
