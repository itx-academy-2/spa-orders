import { PostAddressExtended } from "@/types/delivery.types";

export type DeliveryFormData = PostAddressExtended & {
  addressDropdown: string;
};
export type DeliveryFormProps = {
  totalPrice: number;
  totalDiscountedPrice?: number;
};
