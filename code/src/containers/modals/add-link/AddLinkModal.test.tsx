import { render, screen, waitFor } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { useModalContext } from "@/context/modal/ModalContext";
import { useUpdateUserPhotoMutation } from "@/store/api/userProfileApi";

import AddLinkModal from "./AddLinkModal";

const mockUpdateUserPhotoURL = jest.fn();
const mockCloseModal = jest.fn();

jest.mock("@/context/modal/ModalContext");
jest.mock("@/store/api/userProfileApi");
(useModalContext as jest.Mock).mockReturnValue({
  closeModal: mockCloseModal
});

const renderAndMock = ({ isLoading = false, isSuccess = false } = {}) => {
  (useUpdateUserPhotoMutation as jest.Mock).mockReturnValue([
    mockUpdateUserPhotoURL,
    { isLoading, isSuccess }
  ]);
  render(<AddLinkModal />);
};

const mockPhotoURL = "https://example.com/photo.jpg";

describe("AddLinkModal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the modal correctly", () => {
    renderAndMock();
    const title = screen.getByText("addLink.title");
    const saveButton = screen.getByText("addLink.saveButton");

    expect(title).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  it("should show validation error when no URL", async () => {
    renderAndMock();
    const saveButton = screen.getByText("addLink.saveButton");

    await userEvent.click(saveButton);

    const inputError = screen.getByText("addLink.error.required");
    expect(inputError).toBeInTheDocument();
    expect(mockUpdateUserPhotoURL).not.toHaveBeenCalled();
  });

  it("should successfully update photo when valid URL", async () => {
    renderAndMock({ isSuccess: true });
    const saveButton = screen.getByText("addLink.saveButton");
    const input = screen.getByLabelText("addLink.inputLabel");

    await userEvent.type(input, mockPhotoURL);
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateUserPhotoURL).toHaveBeenCalledTimes(1);
      expect(mockUpdateUserPhotoURL).toHaveBeenCalledWith({
        photo: mockPhotoURL
      });
      expect(mockCloseModal).toHaveBeenCalledTimes(1);
    });
  });

  it("should close when clicking the Close button", async () => {
    renderAndMock();

    const closeBtn = screen.getByText("addLink.closeButton");
    await userEvent.click(closeBtn);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });
  it("should disable Save and show loading state while isLoading", async () => {
    renderAndMock({ isLoading: true });

    const saveButton = screen.getByText("addLink.saveButton").closest("button");
    expect(saveButton).toBeDisabled();
  });

  it("should render the close button with the correct aria-label", () => {
    renderAndMock();

    const closeButton = screen.getByTestId("CloseIcon").parentNode;

    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute("aria-label", "addLink.closeButton");
  });
});
