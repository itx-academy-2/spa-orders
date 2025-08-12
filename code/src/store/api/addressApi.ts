import { appApi } from "@/store/api/appApi";
import { URLS } from "@/constants/requests";
import { httpMethods } from "@/constants/methods";
import { rtkQueryTags } from "@/constants/api-tags";

import { 
    AddressesGetParams,
    UserAddressResponse
} from "@/types/address.types";

export const addressApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    getUserAddresses: build.query<UserAddressResponse[], AddressesGetParams>({
      query: (params) => ({
          url: URLS.address.get(params),
          method: httpMethods.get
      }),
      providesTags: [rtkQueryTags.ADDRESSES],
    }),
  }),
});

export const { useGetUserAddressesQuery } = addressApi;
