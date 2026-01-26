import AppButton from "@/components/app-button/AppButton";
import AppTypography from "@/components/app-typography/AppTypography";

import { ResetFiltersButtonProps } from "@/pages/products/components/products-filter-buttons/reset-filters-button/ResetFiltersButton.types";

import "@/pages/products/components/products-filter-buttons/reset-filters-button/ResetFiltersButton.scss";

const ResetFiltersButton = ({ onClick }: ResetFiltersButtonProps) => (
  <AppButton onClick={onClick} className="reset-filters-button__reset-button">
    <AppTypography
      translationKey="productsFilter.reset"
      data-cy="reset-filters-button"
    />
  </AppButton>
);

export default ResetFiltersButton;
