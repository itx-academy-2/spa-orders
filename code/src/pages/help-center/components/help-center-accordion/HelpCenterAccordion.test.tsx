import { fireEvent, screen } from "@testing-library/react";

import HelpCenterAccordion from "@/pages/help-center/components/help-center-accordion/HelpCenterAccordion";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

jest.mock("github-markdown-css", () => ({}));

const mockProps = {
  title: "Title",
  description: "Descriptino"
};

describe("HelpCenterAccordion", () => {
  beforeEach(() => {
    renderWithProviders(<HelpCenterAccordion {...mockProps} />);
  });

  test("Should render title", () => {
    const accordionTitle = screen.getByTestId("help-center-accordion-summary");
    expect(accordionTitle).toBeInTheDocument();
  });

  test("Should not render description when it is closed", () => {
    const accordionDescription = screen.getByTestId(
      "help-center-accordion-details"
    );

    expect(accordionDescription.closest(".MuiCollapse-hidden")).toBeTruthy();
  });

  test("Should render description once accordion is opened", () => {
    const accordionTitle = screen.getByTestId("help-center-accordion-summary");

    fireEvent.click(accordionTitle);

    const accordionDescription = screen.getByTestId(
      "help-center-accordion-details"
    );

    expect(accordionDescription?.closest(".MuiCollapse-hidden")).toBeFalsy();
  });
});
