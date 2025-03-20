import { rtkQueryTags } from "@/constants/api-tags";
import { httpMethods } from "@/constants/methods";
import { URLS } from "@/constants/requests";
import { appApi } from "@/store/api/appApi";
import {
  ArticleDetails,
  ArticlesResponse,
  GetArticlesParams
} from "@/types/article.types";

const articlesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getArticlesTitle: builder.query<ArticlesResponse, GetArticlesParams>({
      query: (params) => ({
        url: URLS.articles.getArticlesTitle,
        params, // continues to use params directly
        method: httpMethods.get
      }),
      providesTags: [rtkQueryTags.ARTICLES]
    }),
    getArticleById: builder.query<
      ArticleDetails,
      { articleId: number; lang: string }
    >({
      query: ({ articleId, lang }) => ({
        url: URLS.articles.getArticleById(articleId, lang),
        method: httpMethods.get
      }),
      providesTags: [rtkQueryTags.ARTICLES]
    })
  })
});

export const {
  useGetArticlesTitleQuery,
  useGetArticleByIdQuery,
  useLazyGetArticleByIdQuery
} = articlesApi;

export default articlesApi;
