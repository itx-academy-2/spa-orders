import HelpCenterPage from "@/pages/help-center/HelpCenterPage";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

describe("HelpCenterPage", () => {
  test("should render the HelpCenterPage component", () => {
    const { getByTestId } = renderWithProviders(<HelpCenterPage />);

    const helpCenterPage = getByTestId("help-center-page");
    expect(helpCenterPage).toBeInTheDocument();
  });

  test("should render the title with the correct translation key", () => {
    const { getByText } = renderWithProviders(<HelpCenterPage />);

    const titleElement = getByText("helpCenter.title");
    expect(titleElement).toBeInTheDocument();
  });
});
