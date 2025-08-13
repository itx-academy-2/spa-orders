import { UserId } from "@/types/user.types";

export type AddressesGetParams = {
    userId: UserId
};

export type AddressesDeleteParams = {
    userId: UserId;
    addressId: string
};

export type UserAddressResponse = {
  id: string;
  deliveryMethod: string;
  city: string;
  department: string;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
}
