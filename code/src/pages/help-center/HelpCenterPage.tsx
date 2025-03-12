import { useIntl } from "react-intl";

import PageWrapper from "@/layouts/page-wrapper/PageWrapper";

import AppBox from "@/components/app-box/AppBox";
import AppSearchInput from "@/components/app-search-input/AppSearchInput";
import AppTypography from "@/components/app-typography/AppTypography";

import HelpCenterAccordion from "@/pages/help-center/components/help-center-accordion/HelpCenterAccordion";

import "@/pages/help-center/HelpCenterPage.scss";

const mockData = {
  title: "How to make an order?",
  description: `
Ordering goods in our application is simple and intuitive. Follow these steps to complete your purchase smoothly.

#### Step 1: Browse and Select Products

Navigate through our **Products Page** and explore the available items. You can use filters and sorting options to find exactly what you need.

#### Step 3: Proceed to Checkout

When you're ready to place your order:

- Click on the **Cart** icon at the top right corner.
- Review your selected items.
- Click on **Proceed to Checkout**.

![Checkout Process](https://www.searchenginejournal.com/wp-content/uploads/2022/11/checkout-page-examples--637e2d4548746-sej.png)

#### Step 5: Confirm and Place Order

After verifying all information:

- Click **Confirm Order**.
- You will receive an order confirmation via email.

For more details on payment options, visit our [Payment Guide](https://www.searchenginejournal.com/wp-content/uploads/2022/11/checkout-page-examples--637e2d4548746-sej.png).`
};

const HelpCenterPage = () => {
  const { formatMessage } = useIntl();

  return (
    <PageWrapper>
      <AppBox className="help-center-page" data-testid="help-center-page">
        <AppBox
          style={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
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
          <HelpCenterAccordion {...mockData} />
        </AppBox>
      </AppBox>
    </PageWrapper>
  );
};

export default HelpCenterPage;
