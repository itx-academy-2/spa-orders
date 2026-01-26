import AppButton from "@/components/app-button/AppButton";
import AppTypography from "@/components/app-typography/AppTypography";

import { ApplyFiltersButtonProps } from "@/pages/products/components/products-filter-buttons/apply-filters-button/ApplyFiltersButton.types";

const ApplyFiltersButton = ({ onClick }: ApplyFiltersButtonProps) => (
  <AppButton onClick={onClick}>
    <AppTypography
      translationKey="productsFilter.apply"
      data-cy="apply-filters-button"
    />
  </AppButton>
);

export default ApplyFiltersButton;
