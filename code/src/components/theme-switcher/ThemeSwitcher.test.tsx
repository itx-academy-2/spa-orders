import { fireEvent, render, screen } from "@testing-library/react";

import ThemeSwitcher from "./ThemeSwitcher";

describe("ThemeSwitcher", () => {
  it("renders the switch component", () => {
    render(<ThemeSwitcher />);
    const switchElement = screen.getByRole("checkbox");
    expect(switchElement).toBeInTheDocument();
  });

  it("is not checked by default", () => {
    render(<ThemeSwitcher />);
    const switchElement = screen.getByRole("checkbox") as HTMLInputElement;
    expect(switchElement.checked).toBe(false);
  });

  it("toggles checked state when clicked", () => {
    render(<ThemeSwitcher />);
    const switchElement = screen.getByRole("checkbox") as HTMLInputElement;

    fireEvent.click(switchElement);
    expect(switchElement.checked).toBe(true);

    fireEvent.click(switchElement);
    expect(switchElement.checked).toBe(false);
  });
});
