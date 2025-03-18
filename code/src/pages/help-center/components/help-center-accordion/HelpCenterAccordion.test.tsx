import { render, screen } from "@testing-library/react";

import HelpCenterAccordion from "./HelpCenterAccordion";

jest.mock("github-markdown-css", () => ({}));

describe("HelpCenterAccordion", () => {
  test("renders the title and description", () => {
    render(
      <HelpCenterAccordion
        expanded={false}
        onChange={() => {}}
        title="Test Title"
        description="Test Description"
      />
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });
});
