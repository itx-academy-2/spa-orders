import { fireEvent, render, screen } from "@testing-library/react";

import PersonalInformation from "@/components/profile-personal-information/PersonalInformation";

import { useModalContext } from "@/context/modal/ModalContext";

jest.mock("@/store/api/userProfileApi");
jest.mock("@/context/modal/ModalContext");

const mockUser = {
  firstName: "John",
  lastName: "Doe",
  phone: "+380631234567"
};
const mockOpenModal = jest.fn();

describe("PersonalInformation", () => {
  beforeEach(() => {
    (useModalContext as jest.Mock).mockReturnValue({
      openModal: mockOpenModal
    });
    render(
      <PersonalInformation
        firstName={mockUser.firstName}
        lastName={mockUser.lastName}
        phone={mockUser.phone}
      />
    );
  });

  test("should render input fields with correct labels", () => {
    expect(
      screen.getByLabelText(/personalInformation.firstName.field/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/personalInformation.lastName.field/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/personalInformation.phone.field/i)
    ).toBeInTheDocument();
  });

  test("should render first name, last name, and phone", () => {
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("+380631234567")).toBeInTheDocument();
  });

  test("should render disabled inputs", () => {
    expect(screen.getByDisplayValue("John")).toBeDisabled();
    expect(screen.getByDisplayValue("Doe")).toBeDisabled();
    expect(screen.getByDisplayValue("+380631234567")).toBeDisabled();
  });

  test("should open modal on button click", () => {
    fireEvent.click(screen.getByTestId("personal-information-change-button"));
    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });
});
