import { rtkQueryTags } from "@/constants/api-tags";
import { httpMethods } from "@/constants/methods";
import { URLS } from "@/constants/requests";
import { appApi } from "@/store/api/appApi";
import { UserPhotoResponse, UserResponse } from "@/types/user.types";

export const userProfileApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    getUserInfo: build.query<UserResponse, void>({
      query: () => ({
        url: URLS.userInfo.getUserInfo
      }),
      providesTags: [rtkQueryTags.USER_PROFILE]
    }),
    updateUserInfo: build.mutation<
      UserResponse,
      Pick<UserResponse, "firstName" | "lastName" | "phone">
    >({
      query: (body) => ({
        url: URLS.userInfo.patchUserInfo,
        method: httpMethods.patch,
        body
      }),
      invalidatesTags: [rtkQueryTags.USER_PROFILE]
    }),
    updateUserPhoto: build.mutation<UserResponse, Pick<UserResponse, "photo">>({
      query: (body) => ({
        url: URLS.userInfo.photo.put,
        method: httpMethods.put,
        body
      }),
      invalidatesTags: [rtkQueryTags.USER_PROFILE, rtkQueryTags.USER_PHOTO]
    }),
    deleteUserPhoto: build.mutation<void, void>({
      query: () => ({
        url: URLS.userInfo.photo.delete,
        method: httpMethods.delete
      }),
      invalidatesTags: [rtkQueryTags.USER_PROFILE, rtkQueryTags.USER_PHOTO]
    }),
    getUserPhoto: build.query<UserPhotoResponse, void>({
      query: () => ({
        url: URLS.userInfo.photo.get
      }),
      providesTags: [rtkQueryTags.USER_PROFILE, rtkQueryTags.USER_PHOTO]
    })
  })
});

export const {
  useGetUserInfoQuery,
  useUpdateUserInfoMutation,
  useUpdateUserPhotoMutation,
  useGetUserPhotoQuery,
  useDeleteUserPhotoMutation
} = userProfileApi;
