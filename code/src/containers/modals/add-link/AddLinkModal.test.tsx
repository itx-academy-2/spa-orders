import { render, screen, waitFor } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { useModalContext } from "@/context/modal/ModalContext";
import { useUpdateUserPhotoMutation } from "@/store/api/userProfileApi";

import AddLinkModal from "./AddLinkModal";

const mockupdateUserPhotoURL = jest.fn();
const mockCloseModal = jest.fn();

jest.mock("@/context/modal/ModalContext");
jest.mock("@/store/api/userProfileApi");
(useModalContext as jest.Mock).mockReturnValue({
  closeModal: mockCloseModal
});

const renderAndMock = ({ isLoading = false } = {}) => {
  (useUpdateUserPhotoMutation as jest.Mock).mockReturnValue([
    mockupdateUserPhotoURL,
    { isLoading }
  ]);
  render(<AddLinkModal />);
};

const mockPhotoURL = "https://example.com/photo.jpg";

describe("AddLinkModal", () => {
  beforeEach(() => {
    renderAndMock();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should render the modal with correctly", () => {
    const title = screen.getByText("addLink.title");
    const saveButton = screen.getByText("addLink.saveButton");

    expect(title).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  it("should show validation error when no URL", async () => {
    const saveButton = screen.getByText("addLink.saveButton");

    await userEvent.click(saveButton);

    const inputError = screen.getByText("addLink.error.required");
    expect(inputError).toBeInTheDocument();
    expect(mockupdateUserPhotoURL).not.toHaveBeenCalled();
  });

  it("should successfully update photo when valid URL", async () => {
    const saveButton = screen.getByText("addLink.saveButton");
    const input = screen.getByLabelText("addLink.inputLabel");

    await userEvent.type(input, mockPhotoURL);
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockupdateUserPhotoURL).toHaveBeenCalledTimes(1);
      expect(mockupdateUserPhotoURL).toHaveBeenCalledWith({
        photo: mockPhotoURL
      });
    });
  });
});
