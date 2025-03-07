import PageWrapper from "@/layouts/page-wrapper/PageWrapper";

import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";

import "@/pages/help-center/HelpCenterPage.scss";

const HelpCenterPage = () => {
  return (
    <PageWrapper>
      <AppBox className="help-center-page" data-testid="help-center-page">
        <AppTypography
          className="help-center-page__title"
          translationKey="helpCenter.title"
        />
      </AppBox>
    </PageWrapper>
  );
};

export default HelpCenterPage;
