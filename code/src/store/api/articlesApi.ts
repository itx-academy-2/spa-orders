import { rtkQueryTags } from "@/constants/api-tags";
import { httpMethods } from "@/constants/methods";
import { URLS } from "@/constants/requests";
import { appApi } from "@/store/api/appApi";
import {
  ArticleDetails,
  ArticlesResponse,
  GetArticlesParams
} from "@/types/article.types";

export type MinimalArticleTitle = {
  id: number;
  title: string;
};

const articlesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getArticlesTitle: builder.query<ArticlesResponse, GetArticlesParams>({
      query: (params) => ({
        url: URLS.articles.getArticlesTitle,
        params,
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
    }),
    searchArticles: builder.query<
      ArticlesResponse,
      { query?: string; lang?: string; page?: number; size?: number }
    >({
      query: ({ query = "", lang = "uk", page = 0, size = 10 }) => {
        const params: Record<string, string | number> = { lang, page, size };

        if (query.trim()) {
          params.query = query.trim();
        }

        return {
          url: URLS.articles.getArticlesBySearch,
          params
        };
      },
      providesTags: [rtkQueryTags.ARTICLES]
    }),
    getArticlesIdTitle: builder.query<
      MinimalArticleTitle[],
      { query?: string; lang?: string }
    >({
      query: ({ query = "", lang = "en" }) => {
        const params: Record<string, string> = { lang };

        if (query.trim()) {
          params.query = query.trim();
        }

        return {
          url: URLS.articles.getArticlesByTitle,
          params
        };
      },
      providesTags: [rtkQueryTags.ARTICLES]
    })
  })
});

export const {
  useGetArticlesTitleQuery,
  useGetArticleByIdQuery,
  useLazyGetArticleByIdQuery,
  useSearchArticlesQuery,
  useGetArticlesIdTitleQuery
} = articlesApi;

export default articlesApi;
