import { render, screen, fireEvent } from "@testing-library/react";

import PersonalInformation from "@/components/profile-personal-information/PersonalInformation";
import { useGetUserInfoQuery } from "@/store/api/userProfileApi";
import { useModalContext } from "@/context/modal/ModalContext";

jest.mock("@/store/api/userProfileApi");
jest.mock("@/context/modal/ModalContext");

const mockUser = {
  firstName: "John",
  lastName: "Doe",
  phone: "+380631234567"
};

describe("PersonalInformation", () => {
  beforeEach(() => {
    (useGetUserInfoQuery as jest.Mock).mockReturnValue({ data: mockUser });
    (useModalContext as jest.Mock).mockReturnValue({ openModal: jest.fn() });
  });

  test("should render input fields with correct labels", () => {
    render(<PersonalInformation />);

    expect(screen.getByLabelText(/personalInformation.firstName.field/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/personalInformation.lastName.field/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/personalInformation.phone.field/i)).toBeInTheDocument();
    });

  test("should render first name, last name, and phone", () => {
    render(<PersonalInformation />);

    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("+380631234567")).toBeInTheDocument();
  });

  test("should render disabled inputs", () => {
    render(<PersonalInformation />);

    expect(screen.getByDisplayValue("John")).toBeDisabled();
    expect(screen.getByDisplayValue("Doe")).toBeDisabled();
    expect(screen.getByDisplayValue("+380631234567")).toBeDisabled();
  });

  test("should open modal on button click", () => {
    const mockOpenModal = jest.fn();
    (useModalContext as jest.Mock).mockReturnValue({ openModal: mockOpenModal });

    render(<PersonalInformation />);

    fireEvent.click(screen.getByTestId("personal-information-change-button"));
    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });

  test("should return null if user is undefined", () => {
    (useGetUserInfoQuery as jest.Mock).mockReturnValue({ data: undefined });
    const { container } = render(<PersonalInformation />);
    expect(container.firstChild).toBeNull();
  });
});
