import { fireEvent, render, screen } from "@testing-library/react";

import ThemeSwitcher from "./ThemeSwitcher";

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    render(<ThemeSwitcher />);
  });

  it("should render the switch component", () => {
    const switchElement = screen.getByRole("checkbox");
    expect(switchElement).toBeInTheDocument();
  });

  it("should not be checked by default", () => {
    const switchElement = screen.getByRole("checkbox") as HTMLInputElement;
    expect(switchElement.checked).toBe(false);
  });

  it("should toggle checked state when clicked", () => {
    const switchElement = screen.getByRole("checkbox") as HTMLInputElement;

    fireEvent.click(switchElement);
    expect(switchElement.checked).toBe(true);

    fireEvent.click(switchElement);
    expect(switchElement.checked).toBe(false);
  });
});
