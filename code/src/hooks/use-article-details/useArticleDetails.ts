import { useGetArticleByIdQuery } from "@/store/api/articlesApi";

export const useArticleDetails = (
  articleId: number,
  lang: string,
  isExpanded: boolean
) => {
  const skip = !isExpanded;

  const { data, isFetching } = useGetArticleByIdQuery(
    { articleId, lang },
    { skip }
  );

  return {
    description:
      data?.content || (isFetching ? "Loading..." : "No content available")
  };
};
