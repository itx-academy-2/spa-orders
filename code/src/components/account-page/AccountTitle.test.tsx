import { render, screen } from "@testing-library/react";

import AccountTitle from "./AccountTitle";

describe("AccountTitle", () => {
  it("should render title and optional description when provided", () => {
    render(
      <AccountTitle
        title="Customer Account"
        description="Manage your account"
      />
    );

    expect(screen.getByText("Customer Account")).toBeInTheDocument();
    expect(screen.getByText("Manage your account")).toBeInTheDocument();
  });

  it("should not render description when not provided", () => {
    render(<AccountTitle title="Customer Account" />);

    expect(screen.getByText("Customer Account")).toBeInTheDocument();
    expect(screen.queryByText("Manage your account")).not.toBeInTheDocument();
  });
});
