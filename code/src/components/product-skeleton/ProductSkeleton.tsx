import AppBox from "@/components/app-box/AppBox";
import AppSkeleton from "@/components/app-skeleton/AppSkeleton";
import { ProductSkeletonProps } from "@/components/product-skeleton/ProductSkeleton.types";

import "@/components/product-skeleton/ProductSkeleton.scss";

const ProductSkeleton = ({
  width = 254,
  height = 300
}: ProductSkeletonProps) => {
  return (
    <AppBox
      className="spa-product-skeleton"
      data-testid="spa-product-skeleton"
      data-cy="product-skeleton"
    >
      <AppSkeleton
        variant="rectangular"
        height={height}
        width={width}
        animation="pulse"
      />
      <AppBox className="spa-product-skeleton__footer">
        <AppSkeleton variant="text" width={64} height={35} animation="pulse" />
        <AppSkeleton
          variant="circular"
          height={25}
          width={25}
          animation="pulse"
        />
      </AppBox>
    </AppBox>
  );
};

export default ProductSkeleton;
