import { SyntheticEvent, useState } from "react";

import { useArticleDetails } from "@/hooks/use-article-details/useArticleDetails";
import HelpCenterAccordion from "@/pages/help-center/components/help-center-accordion/HelpCenterAccordion";

const HelpCenterAccordionItem = ({
  article,
  lang
}: {
  article: { id: number; title: string };
  lang: string;
}) => {
  const [expanded, setExpanded] = useState(false);

  const { description } = useArticleDetails(article.id, lang, expanded);

  const handleAccordionChange = (
    event: SyntheticEvent,
    newExpanded: boolean
  ) => {
    setExpanded(newExpanded);
  };

  return (
    <HelpCenterAccordion
      expanded={expanded}
      onChange={handleAccordionChange}
      title={article.title}
      description={description}
    />
  );
};

export default HelpCenterAccordionItem;
