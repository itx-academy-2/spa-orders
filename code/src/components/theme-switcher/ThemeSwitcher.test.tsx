import { fireEvent, render, screen } from "@testing-library/react";

import { Theme } from "@/constants/theme";
import { useThemeContext } from "@/context/theme/ThemeContext";

import ThemeSwitcher from "./ThemeSwitcher";

jest.mock("@/context/theme/ThemeContext", () => ({
  useThemeContext: jest.fn()
}));

const mockedToggleTheme = jest.fn();

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    (useThemeContext as jest.Mock).mockReturnValue({
      theme: Theme.Light,
      toggleTheme: mockedToggleTheme
    });
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
    expect(mockedToggleTheme).toHaveBeenCalled();
  });
});
