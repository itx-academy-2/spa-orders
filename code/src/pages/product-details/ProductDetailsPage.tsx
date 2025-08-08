import { useEffect } from "react";
import { useParams } from "react-router-dom";

import PageWrapper from "@/layouts/page-wrapper/PageWrapper";

import AppBox from "@/components/app-box/AppBox";

import { ROLES } from "@/constants/common";
import useErrorPageRedirect from "@/hooks/use-error-page-redirect/useErrorPageRedirect";
import { ProductDetailsPageParams } from "@/pages/product-details/ProductDetails.types";
import { productNotFoundRedirectConfig } from "@/pages/product-details/ProductsDetailsPage.constants";
import ProductDetailsContainer from "@/pages/product-details/components/product-details-container/ProductDetailsContainer";
import { useUpdateViewedProductsMutation } from "@/store/api/viewHistoryApi";
import { useGetUserWishlistQuery } from "@/store/api/wishlistApi";
import {
  useIsAuthSelector,
  useUserRoleSelector
} from "@/store/slices/userSlice";

import "@/pages/product-details/ProductDetailsPage.scss";

const ProductDetailsPage = () => {
  const { productId } = useParams<ProductDetailsPageParams>();
  const { renderRedirectComponent } = useErrorPageRedirect();
  const [addViewProduct] = useUpdateViewedProductsMutation();
  const isAuthenticated = useIsAuthSelector();
  const userRole = useUserRoleSelector();
  const { data: wishlistData } = useGetUserWishlistQuery();

  const wishlist = wishlistData?.content ?? [];

  useEffect(() => {
    if (productId && isAuthenticated && userRole === ROLES.USER) {
      addViewProduct(productId);
    }
  }, [productId, isAuthenticated, addViewProduct, userRole]);

  if (!productId) {
    return renderRedirectComponent(productNotFoundRedirectConfig);
  }

  return (
    <PageWrapper>
      <AppBox className="spa-product-details-page">
        <ProductDetailsContainer productId={productId} wishlist={wishlist} />
      </AppBox>
    </PageWrapper>
  );
};

export default ProductDetailsPage;
