import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { useModalContext } from "@/context/modal/ModalContext";
import { useUpdateUserInfoMutation } from "@/store/api/userProfileApi";

import EditPersonalInfoModal from "./EditPersonalInfoModal";

jest.mock("@/context/modal/ModalContext", () => ({
  useModalContext: jest.fn()
}));
const mockUpdateUserInfo = jest.fn();
jest.mock("@/store/api/userProfileApi");
const mockCloseModal = jest.fn();
(useModalContext as jest.Mock).mockReturnValue({
  closeModal: mockCloseModal
});
(useUpdateUserInfoMutation as jest.Mock).mockReturnValue([
  mockUpdateUserInfo,
  { isLoading: false, isSuccess: true }
]);
const mockValues = {
  firstName: "John",
  lastName: "Doe",
  phone: "1234567890"
};

const mockIncorrectValues = {
  firstName: "J",
  lastName: "D",
  phone: "123"
};

const renderAndMock = ({
  firstName = mockValues.firstName,
  lastName = mockValues.lastName,
  phone = mockValues.phone as string | null,
  isSuccess = false,
  isLoading = false
} = {}) => {
  (useUpdateUserInfoMutation as jest.Mock).mockReturnValue([
    mockUpdateUserInfo,
    { isLoading, isSuccess }
  ]);

  render(
    <EditPersonalInfoModal
      firstName={firstName}
      lastName={lastName}
      phone={phone}
    />
  );
};

describe("EditPersonalInfoModal", () => {
  it("should render the modal with correct initial values", () => {
    renderAndMock();
    const title = screen.getByText("personalInfo.title");
    const inputFirstName = screen.getByLabelText("personalInfo.firstname");
    const inputLastName = screen.getByLabelText("personalInfo.lastname");
    const inputPhone = screen.getByLabelText("personalInfo.phone");

    expect(title).toBeInTheDocument();
    expect(inputFirstName).toHaveValue(mockValues.firstName);
    expect(inputLastName).toHaveValue(mockValues.lastName);
    expect(inputPhone).toHaveValue(mockValues.phone);
  });

  it("should call closeModal when close icon is clicked", async () => {
    renderAndMock({ isSuccess: true });
    const closeIcon = screen.getByTestId("CloseIcon");
    await userEvent.click(closeIcon);

    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("should call updateUserInfo and close modal", async () => {
    renderAndMock({ phone: mockValues.phone });
    const submitButton = screen.getByText("personalInfo.button");

    await userEvent.click(submitButton);

    expect(mockUpdateUserInfo).toHaveBeenCalledWith({
      firstName: mockValues.firstName,
      lastName: mockValues.lastName,
      phone: mockValues.phone
    });

    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("should show validation errors for incorrect input", async () => {
    renderAndMock();
    const inputFirstName = screen.getByLabelText("personalInfo.firstname");
    const inputLastName = screen.getByLabelText("personalInfo.lastname");
    const inputPhone = screen.getByLabelText("personalInfo.phone");

    await userEvent.clear(inputFirstName);
    await userEvent.type(inputFirstName, mockIncorrectValues.firstName);
    await userEvent.clear(inputLastName);
    await userEvent.type(inputLastName, mockIncorrectValues.lastName);
    await userEvent.clear(inputPhone);
    await userEvent.type(inputPhone, mockIncorrectValues.phone);

    const submitButton = screen.getByText("personalInfo.button");
    await userEvent.click(submitButton);

    const firstNameError = screen.getByText(
      "personalInfo.validation.firstName.tooShort"
    );
    const lastNameError = screen.getByText(
      "personalInfo.validation.lastName.tooShort"
    );
    const phoneError = screen.getByText("personalInfo.validation.phone");

    expect(firstNameError).toBeInTheDocument();
    expect(lastNameError).toBeInTheDocument();
    expect(phoneError).toBeInTheDocument();
  });

  it("should not show phone input when phone prop is null", () => {
    renderAndMock({ phone: null });

    const inputPhone = screen.queryByLabelText("personalInfo.phone");
    expect(inputPhone).toBeEmptyDOMElement();
  });

  it("should submit null when phone is empty", async () => {
    renderAndMock({ phone: null });

    const submitButton = screen.getByText("personalInfo.button");
    await userEvent.click(submitButton);

    expect(mockUpdateUserInfo).toHaveBeenCalledWith({
      firstName: mockValues.firstName,
      lastName: mockValues.lastName,
      phone: null
    });
  });
});
