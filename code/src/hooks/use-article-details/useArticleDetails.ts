import { useIntl } from "react-intl";

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

  const { formatMessage } = useIntl();

  return {
    description:
      data?.content ||
      (isFetching
        ? formatMessage({ id: "loading.label" })
        : "No content available")
  };
};
