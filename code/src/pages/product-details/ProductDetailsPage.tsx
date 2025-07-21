import { useEffect } from "react";
import { useParams } from "react-router-dom";

import PageWrapper from "@/layouts/page-wrapper/PageWrapper";

import AppBox from "@/components/app-box/AppBox";

import useErrorPageRedirect from "@/hooks/use-error-page-redirect/useErrorPageRedirect";
import { ProductDetailsPageParams } from "@/pages/product-details/ProductDetails.types";
import { productNotFoundRedirectConfig } from "@/pages/product-details/ProductsDetailsPage.constants";
import ProductDetailsContainer from "@/pages/product-details/components/product-details-container/ProductDetailsContainer";
import { useUpdateViewedProductsMutation } from "@/store/api/viewHistoryApi";
import { useIsAuthSelector } from "@/store/slices/userSlice";

import "@/pages/product-details/ProductDetailsPage.scss";

const ProductDetailsPage = () => {
  const { productId } = useParams<ProductDetailsPageParams>();
  const { renderRedirectComponent } = useErrorPageRedirect();
  const [addViewProduct] = useUpdateViewedProductsMutation();
  const isAuthenticated = useIsAuthSelector();
  if (!productId) {
    return renderRedirectComponent(productNotFoundRedirectConfig);
  }

  useEffect(() => {
    if (isAuthenticated) {
      addViewProduct(productId);
    }
  }, [productId]);

  return (
    <PageWrapper>
      <AppBox className="spa-product-details-page">
        <ProductDetailsContainer productId={productId} />
      </AppBox>
    </PageWrapper>
  );
};

export default ProductDetailsPage;
