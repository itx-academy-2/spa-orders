import { deliveryMethodValues } from "@/constants/deliveryMethods";

export type DeliveryMethod = (typeof deliveryMethodValues)[number];

export type PostAddress = {
  deliveryMethod: DeliveryMethod;
  city: string;
  department: string;
};

export type PostAddressExtended = PostAddress & {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  title: string;
};
