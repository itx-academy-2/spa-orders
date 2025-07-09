import { rtkQueryTags } from "@/constants/api-tags";
import { URLS } from "@/constants/requests";
import { appApi } from "@/store/api/appApi";
import { UserResponse } from "@/types/user.types";

export const userProfileApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    getUserInfo: build.query<UserResponse, void>({
      query: () => ({
        url: URLS.userInfo.getUserInfo
      }),
      providesTags: [rtkQueryTags.USER_PROFILE]
    })
  })
});

export const { useGetUserInfoQuery } = userProfileApi;
