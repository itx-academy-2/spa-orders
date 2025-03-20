import { SyntheticEvent, useState } from "react";
import { useIntl } from "react-intl";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

import { FilterRecordAccordionProps } from "@/containers/dashboard-orders-filter-drawer/components/filter-record-accordion/FilterAccordion.types";

import {
  AppAccordionContainer,
  AppAccordionDetails,
  AppAccordionSummary
} from "@/components/app-accordion/AppAccordion";
import AppBox from "@/components/app-box/AppBox";
import AppIconButton from "@/components/app-icon-button/AppIconButton";
import AppTooltip from "@/components/app-tooltip/AppTooltip";
import AppTypography from "@/components/app-typography/AppTypography";

import cn from "@/utils/cn/cn";

import "@/containers/dashboard-orders-filter-drawer/components/filter-record-accordion/FilterRecordAccordion.scss";

const FilterRecordAccordion = ({
  sectionCaptionTranslationKey,
  defaultExpanded = true,
  isFilterActive = false,
  children,
  className,
  resetFilter
}: FilterRecordAccordionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { formatMessage } = useIntl();

  const translatedFilterName = formatMessage({
    id: sectionCaptionTranslationKey
  }).toLowerCase();

  const handleResetFilter = (event: SyntheticEvent) => {
    event.stopPropagation();
    resetFilter();
  };

  const handleToggleAccordion = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const expanded = isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />;

  const resetFilterButton = isFilterActive && (
    <AppTooltip
      placement="left"
      titleTranslationKey="dashboardTabs.orders.filters.clearFilterTooltip"
      titleTranslationProps={{
        values: {
          filterName: translatedFilterName
        }
      }}
    >
      <AppIconButton
        className="filter-record-accordion__reset-filter-button"
        onClick={handleResetFilter}
        disableRipple
        data-testid={`reset-filter-button-${sectionCaptionTranslationKey}`}
      >
        <FilterAltOffIcon />
      </AppIconButton>
    </AppTooltip>
  );

  const activeFilterIndicator = isFilterActive && (
    <FiberManualRecordIcon
      className="filter-record-accordion--filter-active-icon"
      data-testid="FiberManualRecordIcon"
    />
  );

  return (
    <AppAccordionContainer
      className={cn("filter-record-accordion", className?.container)}
      defaultExpanded={defaultExpanded}
      expanded={isExpanded}
    >
      <AppAccordionSummary
        className={cn("filter-record-accordion__summary", className?.summary)}
        onClick={handleToggleAccordion}
      >
        <AppBox className="filter-record-accordion__summary-group">
          {activeFilterIndicator}
          <AppTypography
            fontWeight="extra-bold"
            translationKey={sectionCaptionTranslationKey}
          />
        </AppBox>
        <AppBox className="filter-record-accordion__summary-group">
          {resetFilterButton}
          {expanded}
        </AppBox>
      </AppAccordionSummary>
      <AppAccordionDetails
        data-testid="accordion-content-wrapper"
        className={cn("filter-record-accordion__details", className?.summary)}
      >
        {children}
      </AppAccordionDetails>
    </AppAccordionContainer>
  );
};

export default FilterRecordAccordion;
