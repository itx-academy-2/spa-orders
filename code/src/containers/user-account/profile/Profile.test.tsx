import { render, screen } from "@testing-library/react";

jest.mock("@/components/app-container/AppContainer", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-container">{children}</div>
  ),
}));

jest.mock("@/components/profile-personal-information/PersonalInformation", () => ({
  __esModule: true,
  default: () => <div data-testid="personal-information">Mocked Personal Information</div>,
}));

import Profile from "@/containers/user-account/profile/Profile";

describe("Profile component", () => {
  it("renders without crashing", () => {
    render(<Profile />);
    expect(screen.getByTestId("app-container")).toBeInTheDocument();
  });

  it("renders PersonalInformation component", () => {
    render(<Profile />);
    const personalInfo = screen.getByTestId("personal-information");
    expect(personalInfo).toBeInTheDocument();
    expect(personalInfo).toHaveTextContent("Mocked Personal Information");
  });
});
