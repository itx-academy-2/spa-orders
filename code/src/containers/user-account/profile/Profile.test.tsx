import { render, screen } from "@testing-library/react";

import Profile from "@/containers/user-account/profile/Profile";

import { useGetUserInfoQuery } from "@/store/api/userProfileApi";

jest.mock("@/components/app-container/AppContainer", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-container">{children}</div>
  )
}));

jest.mock(
  "@/components/profile-personal-information/PersonalInformation",
  () => ({
    __esModule: true,
    default: ({ phone }: { phone: string }) => (
      <div data-testid="personal-information">
        Mocked Personal Information
        <input type="text" disabled value={phone} data-testid="phone-input" />
      </div>
    )
  })
);

jest.mock("@/components/profile-email-password/EmailAndPassword", () => ({
  __esModule: true,
  default: () => <div data-testid="email-password">Mocked Email & Password</div>
}));

jest.mock("@/store/api/userProfileApi");

type mockedDataProps = {
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string;
};
const mockUser = {
  firstName: "John",
  lastName: "Doe",
  phone: "+380631234567",
  email: "email@mail.com"
};

const renderAndMock = ({
  data,
  isLoading = false,
  isError = false
}: {
  data: mockedDataProps | null;
  isLoading?: boolean;
  isError?: boolean;
}) => {
  (useGetUserInfoQuery as jest.Mock).mockReturnValue({
    data,
    isLoading,
    isError
  });

  render(<Profile />);
};

describe("Profile component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    renderAndMock({ data: mockUser });
    const title = screen.getByText("profile.title");
    const container = screen.getByTestId("app-container");

    expect(title).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it("renders PersonalInformation component", () => {
    renderAndMock({ data: mockUser });
    const personalInfo = screen.getByTestId("personal-information");
    expect(personalInfo).toBeInTheDocument();
    expect(personalInfo).toHaveTextContent("Mocked Personal Information");
  });

  it("should return null when there not such user", () => {
    renderAndMock({ data: null });
    const personalInfo = screen.queryByTestId("personal-information");

    expect(personalInfo).not.toBeInTheDocument();
  });

  it("should send empty phone when phone is null", () => {
    renderAndMock({ data: { ...mockUser, phone: null } });
    const phoneInput = screen.queryByTestId("phone-input") as HTMLInputElement;

    expect(phoneInput).toBeInTheDocument();
    expect(phoneInput.value).toBe("");
  });

  it("should show loder", () => {
    renderAndMock({ data: mockUser, isLoading: true });
    const loader = screen.getByRole("progressbar");

    expect(loader).toBeInTheDocument();
  });

  it("should show loder", () => {
    renderAndMock({ data: mockUser, isError: true });
    const errorMessage = screen.getByText("profile.error.label");

    expect(errorMessage).toBeInTheDocument();
  });
});
