import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";

import PageWrapper from "@/layouts/page-wrapper/PageWrapper";

import AppBox from "@/components/app-box/AppBox";
import AppSearchInput from "@/components/app-search-input/AppSearchInput";
import AppTypography from "@/components/app-typography/AppTypography";
import HelpCenterSearchInputDropdown from "@/components/help-center-search-dropdown/help-center-search-input-dropdown/HelpCenterSearchInputDropdown";

import { useLocaleContext } from "@/context/i18n/I18nProvider";
import useDebouncedValue from "@/hooks/use-debounced-value/useDebouncedValue";
import HelpCenterAccordionItem from "@/pages/help-center/components/help-cener-accordion-item/HelpCenterAccordionItem";
import HelpCenterArticlesSkeleton from "@/pages/help-center/components/help-center-skeleton/HelpCenterSkeleton";
import {
  useGetArticlesTitleQuery,
  useSearchArticlesQuery
} from "@/store/api/articlesApi";

import "@/pages/help-center/HelpCenterPage.scss";

const HelpCenterPage = () => {
  const { formatMessage } = useIntl();
  const { locale } = useLocaleContext();

  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebouncedValue(inputValue, 600);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedArticleId, setExpandedArticleId] = useState<number | null>(
    null
  );

  useEffect(() => {
    setSearchQuery(debouncedInputValue.trim());
  }, [debouncedInputValue]);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      setInputValue(e.target.value);
    },
    []
  );

  const handleSearch = useCallback((): void => {
    setSearchQuery(inputValue.trim());
  }, [inputValue]);

  const handleClear = useCallback((): void => {
    setInputValue("");
    setSearchQuery("");
  }, []);

  const handleSelectSearchResult = useCallback((articleId: number): void => {
    setExpandedArticleId(articleId);
    setInputValue("");
    setSearchQuery("");

    setTimeout(() => {
      const element = document.getElementById(
        `helpcenter-article-${articleId}`
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }, []);

  const handleToggleArticle = useCallback((articleId: number) => {
    setExpandedArticleId((prevId) => (prevId === articleId ? null : articleId));
  }, []);

  const defaultArticlesQuery = useGetArticlesTitleQuery({ lang: locale });
  const searchArticlesQuery = useSearchArticlesQuery(
    { query: searchQuery, lang: locale },
    { skip: !searchQuery }
  );

  const defaultArticles = defaultArticlesQuery.data?.content;
  const defaultLoading = defaultArticlesQuery.isLoading;

  const renderDefaultArticlesContent = () => {
    if (defaultLoading) {
      return <HelpCenterArticlesSkeleton />;
    }
    if (defaultArticles && defaultArticles.length) {
      return defaultArticles.map((article) => (
        <AppBox id={`helpcenter-article-${article.id}`} key={article.id}>
          <HelpCenterAccordionItem
            article={article}
            lang={locale}
            expanded={expandedArticleId === article.id}
            onToggle={() => handleToggleArticle(article.id)}
          />
        </AppBox>
      ));
    }
    return (
      <AppTypography
        className="help-center-page__no-results"
        translationKey="helpCenter.noResults"
      />
    );
  };

  const minimalResults =
    Array.isArray(searchArticlesQuery.data) && searchArticlesQuery.data.length
      ? searchArticlesQuery.data.map((article) => ({
          id: article.id,
          title: article.title
        }))
      : [];

  const renderSearchDropdown = () => {
    if (searchArticlesQuery.isLoading) {
      return <HelpCenterArticlesSkeleton />;
    }
    if (minimalResults.length) {
      return (
        <HelpCenterSearchInputDropdown
          searchResults={minimalResults}
          onResultClick={handleSelectSearchResult}
          handleCloseDropdown={() => {}}
        />
      );
    }
    if (searchQuery) {
      return (
        <AppTypography
          className="help-center-page__no-results"
          translationKey="helpCenter.noResults"
        />
      );
    }
    return null;
  };

  return (
    <PageWrapper>
      <AppBox className="help-center-page" data-testid="help-center-page">
        <AppBox style={{ display: "flex", justifyContent: "space-between" }}>
          <AppTypography
            className="help-center-page__title"
            translationKey="helpCenter.title"
          />
          <AppBox style={{ position: "relative" }}>
            <AppSearchInput
              value={inputValue}
              onChange={handleInputChange}
              onSearch={handleSearch}
              onClear={handleClear}
              placeholder={formatMessage({
                id: "helpCenter.searchbar.placeholder"
              })}
              className="help-center-page__search-input"
              data-testid="help-center-search-input"
            />
            {searchQuery && (
              <AppBox className="help-center-search-dropdown-wrapper">
                {renderSearchDropdown()}
              </AppBox>
            )}
          </AppBox>
        </AppBox>
        <AppBox className="help-center-page__articles">
          {renderDefaultArticlesContent()}
        </AppBox>
      </AppBox>
    </PageWrapper>
  );
};

export default HelpCenterPage;
