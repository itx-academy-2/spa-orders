import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { useModalContext } from "@/context/modal/ModalContext";

import EditPersonalInfoModal from "./EditPersonalInfoModal";

jest.mock("@/context/modal/ModalContext", () => ({
  useModalContext: jest.fn()
}));

const mockCloseModal = jest.fn();
(useModalContext as jest.Mock).mockReturnValue({
  closeModal: mockCloseModal
});

const mockValues = {
  firstName: "John",
  lastName: "Doe",
  phone: "1234567890"
};
describe("EditPersonalInfoModal", () => {
  beforeEach(() => {
    render(
      <EditPersonalInfoModal
        firstName={mockValues.firstName}
        lastName={mockValues.lastName}
        phone={mockValues.phone}
      />
    );
  });
  it("should render the modal with correct initial values", () => {
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
    const closeIcon = screen.getByTestId("CloseIcon");
    await userEvent.click(closeIcon);

    expect(mockCloseModal).toHaveBeenCalled();
  });
});
