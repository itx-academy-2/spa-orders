import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import PhotoSection from "@/components/profile-photo/PhotoSection";

import { useModalContext } from "@/context/modal/ModalContext";
import { useDeleteUserPhotoMutation } from "@/store/api/userProfileApi";

const mockDeleteUserPhoto = jest.fn();
const mockOpenModal = jest.fn();

jest.mock("@/store/api/userProfileApi");

jest.mock("@/context/modal/ModalContext", () => ({
  useModalContext: jest.fn()
}));

const renderAndMock = (photo: string | null) => {
  (useDeleteUserPhotoMutation as jest.Mock).mockReturnValue([
    mockDeleteUserPhoto
  ]);
  (useModalContext as jest.Mock).mockReturnValue({
    openModal: mockOpenModal,
    closeModal: jest.fn()
  });

  render(<PhotoSection photo={photo} />);
};

const mockedPhoto = "https://example.com/photo.jpg";

describe("PhotoSection", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should renders correctly with default photo", () => {
    renderAndMock(null);

    const title = screen.getByText("photoSection.title");
    const image = screen.getByAltText("Profile photo");

    expect(title).toBeInTheDocument();
    expect(image).toBeInTheDocument();
  });

  it("should open upload modal", async () => {
    renderAndMock(null);

    const uploadBtn = screen.getByTestId("upload-photo-button");
    await userEvent.click(uploadBtn);

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });

  it("should open confirm modal", async () => {
    renderAndMock(null);

    const removeBtn = screen.getByTestId("remove-photo-button");
    await userEvent.click(removeBtn);

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });

  it("should show not default image", async () => {
    renderAndMock(mockedPhoto);

    const image = screen.getByAltText("Profile photo") as HTMLImageElement;

    expect(image).toBeInTheDocument();
    expect(image.src).toBe(mockedPhoto);
  });
});
