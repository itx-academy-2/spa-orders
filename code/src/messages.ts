import dashboardLayoutMessages from "@/layouts/dashboard-layout/messages";
import footerMessages from "@/layouts/footer/messages";
import headerMessages from "@/layouts/header/messages";

import bestSellersMessages from "@/containers/best-sellers/messages";
import callToActionSectionMessages from "@/containers/call-to-action/messages";
import cartDrawerMessages from "@/containers/cart-drawer/message";
import categorySectionMessages from "@/containers/category-section/messages";
import confirDialogMessages from "@/containers/confirm-dialog/messages";
import dashboardOrdersFilterMessages from "@/containers/dashboard-orders-filter-drawer/messages";
import deliveryFormMessages from "@/containers/forms/delivery-form/messages";
import productFormMessages from "@/containers/forms/product-form/messages";
import signInFormMessages from "@/containers/forms/sign-in-form/messages";
import signupFormMessages from "@/containers/forms/sign-up-form/messages";
import bannerMessages from "@/containers/intro-banner/messages";
import authModalMessages from "@/containers/modals/auth/messages";
import orderItemMessages from "@/containers/order-item/messages";
import subintroMessages from "@/containers/subintro/messages";
import ordersTableMessages from "@/containers/tables/orders-table/messages";
import productsTableMessages from "@/containers/tables/products-table/messages";
import usersTableMessages from "@/containers/tables/users-table/messages";

import dropDownMessages from "@/components/app-dropdown/messages";
import productCardMessages from "@/components/product-card/messages";

import commonMessages from "@/constants/common-messages";
import { Locale } from "@/context/i18n/I18nProvider";
import cartPageMessages from "@/pages/cart/messages";
import dashboardOrderDetailsPageMessages from "@/pages/dashboard-order-details/messages";
import dashboardNewProductPageMessages from "@/pages/dashboard/dashboard-new-product/messages";
import dashboardOrdersPageMessages from "@/pages/dashboard/dashboard-orders/messages";
import dashboardProductMessages from "@/pages/dashboard/dashboard-product/messages";
import dashboardProductsPageMessages from "@/pages/dashboard/dashboard-products/messages";
import dashboardUpdateProductPageMessages from "@/pages/dashboard/dashboard-update-product/messages";
import notFoundMessages from "@/pages/not-found/messages";
import orderPageMessages from "@/pages/orders/messages";
import productDetailsMessages from "@/pages/product-details/messages";
import productsItemsMessages from "@/pages/products/messages";
import salesPageMessages from "@/pages/sales/messages";

type MessagesType = Record<Locale, Record<string, string>>;

const messages: MessagesType = {
  en: {
    ...commonMessages.en,
    ...footerMessages.en,
    ...headerMessages.en,
    ...bannerMessages.en,
    ...bestSellersMessages.en,
    ...subintroMessages.en,
    ...categorySectionMessages.en,
    ...productCardMessages.en,
    ...productsItemsMessages.en,
    ...callToActionSectionMessages.en,
    ...authModalMessages.en,
    ...orderItemMessages.en,
    ...dropDownMessages.en,
    ...signupFormMessages.en,
    ...signInFormMessages.en,
    ...orderPageMessages.en,
    ...notFoundMessages.en,
    ...cartPageMessages.en,
    ...cartDrawerMessages.en,
    ...ordersTableMessages.en,
    ...cartPageMessages.en,
    ...deliveryFormMessages.en,
    ...productsTableMessages.en,
    ...dashboardLayoutMessages.en,
    ...dashboardOrdersFilterMessages.en,
    ...dashboardOrdersPageMessages.en,
    ...dashboardOrderDetailsPageMessages.en,
    ...dashboardProductsPageMessages.en,
    ...dashboardNewProductPageMessages.en,
    ...dashboardUpdateProductPageMessages.en,
    ...productDetailsMessages.en,
    ...usersTableMessages.en,
    ...productFormMessages.en,
    ...dashboardOrderDetailsPageMessages.en,
    ...productDetailsMessages.en,
    ...dashboardProductMessages.en,
    ...salesPageMessages.en,
    ...confirDialogMessages.en
  },
  uk: {
    ...commonMessages.uk,
    ...footerMessages.uk,
    ...headerMessages.uk,
    ...bannerMessages.uk,
    ...bestSellersMessages.uk,
    ...subintroMessages.uk,
    ...categorySectionMessages.uk,
    ...productCardMessages.uk,
    ...productsItemsMessages.uk,
    ...callToActionSectionMessages.uk,
    ...authModalMessages.uk,
    ...orderItemMessages.uk,
    ...dropDownMessages.uk,
    ...notFoundMessages.uk,
    ...signupFormMessages.uk,
    ...signInFormMessages.uk,
    ...orderPageMessages.uk,
    ...cartPageMessages.uk,
    ...cartDrawerMessages.uk,
    ...ordersTableMessages.uk,
    ...cartPageMessages.uk,
    ...deliveryFormMessages.uk,
    ...productsTableMessages.uk,
    ...dashboardLayoutMessages.uk,
    ...dashboardOrdersFilterMessages.uk,
    ...dashboardOrdersPageMessages.uk,
    ...dashboardOrderDetailsPageMessages.uk,
    ...dashboardProductsPageMessages.uk,
    ...dashboardNewProductPageMessages.uk,
    ...productFormMessages.uk,
    ...dashboardUpdateProductPageMessages.uk,
    ...usersTableMessages.uk,
    ...dashboardOrderDetailsPageMessages.uk,
    ...productDetailsMessages.uk,
    ...dashboardProductMessages.uk,
    ...salesPageMessages.uk,
    ...confirDialogMessages.uk
  }
};

export default messages;
