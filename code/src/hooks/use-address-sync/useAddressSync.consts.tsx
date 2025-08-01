import type { PostAddressExtended } from "@/types/delivery.types";

export const addressSyncFields = [
  "firstName",
  "lastName",
  "phone",
  "city",
  "department",
  "deliveryMethod"
] as const satisfies readonly (keyof PostAddressExtended)[];
