import { useIntl } from "react-intl";

import PageWrapper from "@/layouts/page-wrapper/PageWrapper";

import AppBox from "@/components/app-box/AppBox";
import AppSearchInput from "@/components/app-search-input/AppSearchInput";
import AppTypography from "@/components/app-typography/AppTypography";

import { useLocaleContext } from "@/context/i18n/I18nProvider";
import HelpCenterAccordionItem from "@/pages/help-center/components/help-cener-accordion-item/HelpCenterAccordionItem";
import { useGetArticlesTitleQuery } from "@/store/api/articlesApi";

import "@/pages/help-center/HelpCenterPage.scss";

const HelpCenterPage = () => {
  const { formatMessage } = useIntl();
  const { locale } = useLocaleContext();

  const { data: articlesData } = useGetArticlesTitleQuery({
    lang: locale,
    size: 30
  });

  const content = articlesData?.content;

  return (
    <PageWrapper>
      <AppBox className="help-center-page" data-testid="help-center-page">
        <AppBox style={{ display: "flex", justifyContent: "space-between" }}>
          <AppTypography
            className="help-center-page__title"
            translationKey="helpCenter.title"
          />
          <AppBox className="help-center-page__search-input-container">
            <AppSearchInput
              disabled={true}
              data-testid="help-center-search-input"
              placeholder={formatMessage({
                id: "helpCenter.searchbar.placeholder"
              })}
              className="help-center-page__search-input"
            />
          </AppBox>
        </AppBox>
        <AppBox className="help-center-page__articles">
          {content?.map((article) => (
            <HelpCenterAccordionItem
              key={article.id}
              article={article}
              lang={locale}
            />
          ))}
        </AppBox>
      </AppBox>
    </PageWrapper>
  );
};

export default HelpCenterPage;
