import { appApi } from "@/store/api/appApi";
import { URLS } from "@/constants/requests";
import { httpMethods } from "@/constants/methods";
import { rtkQueryTags } from "@/constants/api-tags";

import { 
    AddressesGetParams,
    AddressesDeleteParams,
} from "@/types/address.types";
import { PostAddressExtended } from "@/types/delivery.types";

export const addressApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    getUserAddresses: build.query<PostAddressExtended[], AddressesGetParams>({
      query: (params) => ({
          url: URLS.address.get(params),
          method: httpMethods.get
      }),
      providesTags: [rtkQueryTags.ADDRESSES],
    }),
    removeUserPermanentAddress: build.mutation<void, AddressesDeleteParams>({
      query: (params) => ({
        url: URLS.address.delete(params),
        method: httpMethods.delete
      }),
      invalidatesTags: [rtkQueryTags.ADDRESSES]
    })
  }),
});

export const {
  useGetUserAddressesQuery,
  useRemoveUserPermanentAddressMutation
} = addressApi;
