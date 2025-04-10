import { fireEvent, render, screen } from "@testing-library/react";

import HelpCenterAccordion from "@/pages/help-center/components/help-center-accordion/HelpCenterAccordion";

jest.mock("github-markdown-css", () => ({}));

jest.mock(
  "@/pages/help-center/components/help-cener-accordion-item/components/HelpCenterAccordionItemSkeleton",
  () => {
    const MockSkeleton = () => (
      <div data-testid="help-center-accordion-item-skeleton" />
    );
    MockSkeleton.displayName = "HelpCenterAccordionItemSkeleton";
    return MockSkeleton;
  }
);

const title = "Test Title";
const description = "Test Description";

describe("HelpCenterAccordion", () => {
  test("renders the title and parsed description when not loading", () => {
    render(
      <HelpCenterAccordion
        expanded={false}
        onChange={() => {}}
        title={title}
        description={description}
        isLoading={false}
      />
    );

    expect(screen.getByText(title)).toBeInTheDocument();

    expect(screen.getByText("Test Description")).toBeInTheDocument();

    expect(
      screen.queryByTestId("help-center-accordion-item-skeleton")
    ).not.toBeInTheDocument();
  });

  test("renders skeleton when loading", () => {
    render(
      <HelpCenterAccordion
        expanded={false}
        onChange={() => {}}
        title={title}
        description={description}
        isLoading={true}
      />
    );

    expect(
      screen.getByTestId("help-center-accordion-item-skeleton")
    ).toBeInTheDocument();

    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
  });

  test("calls onChange when accordion summary is clicked", () => {
    const onChangeMock = jest.fn();
    render(
      <HelpCenterAccordion
        expanded={false}
        onChange={onChangeMock}
        title={title}
        description={description}
        isLoading={false}
      />
    );

    const summary = screen.getByTestId("help-center-accordion-summary");

    fireEvent.click(summary);

    expect(onChangeMock).toHaveBeenCalled();
  });
});
