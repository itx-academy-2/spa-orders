import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { useArticleDetails } from "@/hooks/use-article-details/useArticleDetails";

import HelpCenterAccordionItem from "./HelpCenterAccordionItem";

jest.mock("@/hooks/use-article-details/useArticleDetails", () => ({
  useArticleDetails: jest.fn()
}));

(useArticleDetails as jest.Mock).mockImplementation(
  (id: number, lang: string, expanded: boolean) => ({
    description: expanded ? "Test Description" : ""
  })
);

jest.mock(
  "@/pages/help-center/components/help-center-accordion/HelpCenterAccordion",
  () => {
    const MockHelpCenterAccordion = (props: {
      expanded: boolean;
      onChange: (e: React.SyntheticEvent, newExpanded: boolean) => void;
      title: string;
      description: string;
    }) => {
      return (
        <div>
          <div>{props.title}</div>
          {props.expanded && <div>{props.description}</div>}
          <button onClick={(e) => props.onChange(e, !props.expanded)}>
            Toggle
          </button>
        </div>
      );
    };
    MockHelpCenterAccordion.displayName = "MockHelpCenterAccordion";
    return MockHelpCenterAccordion;
  }
);

describe("HelpCenterAccordionItem", () => {
  const article = { id: 1, title: "Test Article" };
  const lang = "en";

  test("renders article title and does not show description initially", () => {
    render(<HelpCenterAccordionItem article={article} lang={lang} />);

    expect(screen.getByText("Test Article")).toBeInTheDocument();
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
  });

  test("expands accordion and shows description on toggle", () => {
    render(<HelpCenterAccordionItem article={article} lang={lang} />);

    const toggleButton = screen.getByText("Toggle");

    fireEvent.click(toggleButton);

    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });
});
