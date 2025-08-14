import { UserId } from "@/types/user.types";

export type AddressesGetParams = {
  userId: UserId;
};

export type AddressesDeleteParams = {
  userId: UserId;
  addressId: string;
};
