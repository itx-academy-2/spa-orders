import { SyntheticEvent } from "react";

export type HelpCenterAccordionProps = {
  expanded: boolean;
  onChange: (event: SyntheticEvent, newExpanded: boolean) => void;
  title: string;
  description: string;
};
