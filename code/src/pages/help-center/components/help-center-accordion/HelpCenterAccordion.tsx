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

import { HelpCenterAccordionProps } from "@/pages/help-center/components/help-center-accordion/HelpCenterAccordion.types";

import "@/pages/help-center/components/help-center-accordion/HelpCenterAccordion.styles.scss";

const HelpCenterAccordion = ({
  title,
  description
}: HelpCenterAccordionProps) => {
  const desc = marked.parse(description) as string;

  return (
    <AppAccordionContainer data-testid="help-center-accordion">
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
        <AppBox
          className="markdown-body help-center-accordion__description"
          dangerouslySetInnerHTML={{ __html: desc }}
        />
      </AppAccordionDetails>
    </AppAccordionContainer>
  );
};

export default HelpCenterAccordion;
