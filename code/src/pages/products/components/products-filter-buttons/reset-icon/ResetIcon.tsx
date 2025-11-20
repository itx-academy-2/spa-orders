import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import AppBadge from "@/components/app-badge/AppBadge";
import AppIconButton from "@/components/app-icon-button/AppIconButton";
import AppTooltip from "@/components/app-tooltip/AppTooltip";

import { ResetIconProps } from "@/pages/products/components/products-filter-buttons/reset-icon/ResetIcon.types";
import "@/pages/products/components/products-filter-buttons/reset-icon/ResetIcon.scss";

const ResetIcon = ({ activeFiltersCount, onClick }: ResetIconProps) => {
  if (activeFiltersCount === 0) return null;

  return (
    <AppTooltip
      titleTranslationKey="productsFilter.clear"
      className="reset-filters-icon__clear-filters-tooltip"
    >
      <AppBadge badgeContent={activeFiltersCount} size="small">
        <AppIconButton
          onClick={onClick}
          data-testid="reset-filters-icon-clear-filters-icon"
        >
          <FilterListOffIcon />
        </AppIconButton>
      </AppBadge>
    </AppTooltip>
  );
};

export default ResetIcon;
