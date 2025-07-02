import { render, screen } from "@testing-library/react";

import AccountTitle from "./AccountTitle";

describe("AccountTitle", () => {
  it("should render title", () => {
    render(<AccountTitle title="Customer Account" />);
    expect(screen.getByText("Customer Account")).toBeInTheDocument();
  });

  it("should render description when provided", () => {
    render(
      <AccountTitle
        title="Customer Account"
        description="Manage your account"
      />
    );
    expect(screen.getByText("Manage your account")).toBeInTheDocument();
  });

  it("should not render description when not provided", () => {
    render(<AccountTitle title="Customer Account" />);
    const description = screen.queryByText("Manage your account");
    expect(description).not.toBeInTheDocument();
  });
});
