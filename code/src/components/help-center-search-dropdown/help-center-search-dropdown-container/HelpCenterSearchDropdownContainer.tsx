import { FC } from "react";

import HelpCenterSearchInputDropdown from "@/components/help-center-search-dropdown/help-center-search-input-dropdown/HelpCenterSearchInputDropdown";

import { useGetArticlesIdTitleQuery } from "@/store/api/articlesApi";

interface HelpCenterSearchDropdownContainerProps {
  query: string;
}

const HelpCenterSearchDropdownContainer: FC<
  HelpCenterSearchDropdownContainerProps
> = ({ query }) => {
  const trimmedQuery = query.trim();

  const { data, isLoading, isError } = useGetArticlesIdTitleQuery(
    { query: trimmedQuery, lang: "en" },
    { skip: trimmedQuery.length < 3 }
  );

  if (isLoading || isError || !data) {
    return null;
  }

  return <HelpCenterSearchInputDropdown searchResults={data} />;
};

export default HelpCenterSearchDropdownContainer;
