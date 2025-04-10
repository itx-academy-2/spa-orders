import { SyntheticEvent, useEffect, useState } from "react";

import { useArticleDetails } from "@/hooks/use-article-details/useArticleDetails";
import HelpCenterAccordion from "@/pages/help-center/components/help-center-accordion/HelpCenterAccordion";

interface HelpCenterAccordionItemProps {
  article: { id: number; title: string };
  lang: string;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

const HelpCenterAccordionItem = ({
  article,
  lang,
  expanded: expandedProp,
  onToggle
}: HelpCenterAccordionItemProps) => {
  const [expanded, setExpanded] = useState(expandedProp ?? false);

  useEffect(() => {
    if (expandedProp !== undefined) {
      setExpanded(expandedProp);
    }
  }, [expandedProp]);

  const { description, isLoading } = useArticleDetails(
    article.id,
    lang,
    expanded
  );

  const handleAccordionChange = (
    event: SyntheticEvent,
    newExpanded: boolean
  ) => {
    setExpanded(newExpanded);
    onToggle?.(newExpanded);
  };

  return (
    <HelpCenterAccordion
      expanded={expanded}
      onChange={handleAccordionChange}
      title={article.title}
      description={description}
      isLoading={isLoading}
    />
  );
};

export default HelpCenterAccordionItem;
