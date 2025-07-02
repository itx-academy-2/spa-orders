import { render, screen, act } from "@testing-library/react";

import { ThemeProvider, useThemeContext } from "@/context/theme/ThemeContext";

import { Theme } from '@/constants/theme';

import * as themeStorage from '@/utils/theme-storage/themeStorage';

const TestComponent = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    jest.restoreAllMocks();
  });
  test("useEffect calls initializeTheme and sets theme correctly", () => {
    jest.spyOn(themeStorage, "initializeTheme").mockReturnValue(Theme.Dark);
    const setStoredThemeMock = jest.spyOn(themeStorage, "setStoredTheme").mockImplementation(() => {});

        render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(themeStorage.initializeTheme).toHaveBeenCalled();
    expect(setStoredThemeMock).toHaveBeenCalledWith(Theme.Dark);
    expect(document.documentElement.getAttribute("data-theme")).toBe(Theme.Dark);
    expect(screen.getByTestId("theme").textContent).toBe(Theme.Dark);
  });
  test("toggleTheme switches theme and updates localStorage and data-theme attribute", () => {
    localStorage.setItem("theme", Theme.Light);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeSpan = screen.getByTestId("theme");
    const button = screen.getByRole("button", { name: /toggle/i });

    expect(themeSpan.textContent).toBe(Theme.Light);

    act(() => {
      button.click();
    });

    expect(themeSpan.textContent).toBe(Theme.Dark);
    expect(localStorage.getItem("theme")).toBe(Theme.Dark);
    expect(document.documentElement.getAttribute("data-theme")).toBe(Theme.Dark);

    act(() => {
      button.click();
    });

    expect(themeSpan.textContent).toBe(Theme.Light);
    expect(localStorage.getItem("theme")).toBe(Theme.Light);
    expect(document.documentElement.getAttribute("data-theme")).toBe(Theme.Light);
  });
  test("useThemeContext throws error if used outside ThemeProvider", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    const Component = () => {
      useThemeContext();
      return null;
    };

    expect(() => render(<Component />)).toThrow(
      "useThemeContext must be used within a ThemeProvider"
    );

    consoleError.mockRestore();
  });
});