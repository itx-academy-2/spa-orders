import { render, screen, act } from "@testing-library/react";

import { ThemeProvider, useThemeContext } from "@/context/theme/ThemeContext";

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
  });

  test("defaults to light theme if localStorage is empty and prefers-color-scheme is not dark", () => {
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches: false,
        media: query,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme").textContent).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  test("sets dark theme if prefers-color-scheme is dark", () => {
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme").textContent).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  test("loads theme from localStorage if it exists", () => {
    localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme").textContent).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  test("toggleTheme switches theme and updates localStorage and data-theme attribute", () => {
    localStorage.setItem("theme", "light");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeSpan = screen.getByTestId("theme");
    const button = screen.getByRole("button", { name: /toggle/i });

    expect(themeSpan.textContent).toBe("light");

    act(() => {
      button.click();
    });

    expect(themeSpan.textContent).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    act(() => {
      button.click();
    });

    expect(themeSpan.textContent).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
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