import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "github-markdown-css";
import { marked } from "marked";

import {
  AppAccordionContainer,
  AppAccordionDetails,
  AppAccordionSummary
} from "@/components/app-accordion/AppAccordion";
import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";

import HelpCenterAccordionItemSkeleton from "@/pages/help-center/components/help-cener-accordion-item/components/HelpCenterAccordionItemSkeleton";
import { HelpCenterAccordionProps } from "@/pages/help-center/components/help-center-accordion/HelpCenterAccordion.types";

import "@/pages/help-center/components/help-center-accordion/HelpCenterAccordion.styles.scss";

const HelpCenterAccordion = ({
  expanded,
  onChange,
  title,
  description,
  isLoading
}: HelpCenterAccordionProps) => {
  const desc = !isLoading ? marked.parse(description) : "";

  const accordionDetails = isLoading ? (
    <HelpCenterAccordionItemSkeleton />
  ) : (
    <AppBox
      className="markdown-body help-center-accordion__description"
      dangerouslySetInnerHTML={{ __html: desc }}
    />
  );

  return (
    <AppAccordionContainer
      data-testid="help-center-accordion"
      expanded={expanded}
      onChange={onChange}
    >
      <AppAccordionSummary
        data-testid="help-center-accordion-summary"
        expandIcon={<ExpandMoreIcon />}
      >
        <AppTypography
          variant="subtitle2"
          className="help-center-accordion__title"
        >
          {title}
        </AppTypography>
      </AppAccordionSummary>
      <AppAccordionDetails data-testid="help-center-accordion-details">
        {accordionDetails}
      </AppAccordionDetails>
    </AppAccordionContainer>
  );
};

export default HelpCenterAccordion;
