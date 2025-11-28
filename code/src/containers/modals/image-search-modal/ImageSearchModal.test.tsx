import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageSearchModal from "@/containers/modals/image-search-modal/ImageSearchModal";
import { useModalContext } from "@/context/modal/ModalContext";
import { useSearchParams } from "react-router-dom";
import ImageSearch from "@/containers/modals/image-search-modal/components/image-search/ImageSearch";

jest.mock("@/context/modal/ModalContext");
jest.mock("react-router-dom", () => ({ useSearchParams: jest.fn() }));
jest.mock("@/containers/modals/image-search-modal/components/image-search/ImageSearch");

const mockModal = useModalContext as jest.Mock;
const mockUseSearchParams = useSearchParams as jest.Mock;
const mockImageSearch = ImageSearch as jest.Mock;

describe("ImageSearchModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockModal.mockReturnValue({ closeModal: jest.fn() });

    const setSearchParams = jest.fn();
    mockUseSearchParams.mockReturnValue([{ get: () => "" }, setSearchParams]);

    mockImageSearch.mockImplementation((props: { onSelect: (url: string) => void; onSearch: (val: string) => void }) => (
      <div>
        <button onClick={() => props.onSelect("img.jpg")}>Select Image</button>
        <button onClick={() => props.onSearch("cat")}>Search</button>
      </div>
    ));
  });

  test("renders modal with title", () => {
    render(<ImageSearchModal onSelect={jest.fn()} />);
    expect(screen.getByText("searchImageModal.title")).toBeInTheDocument();
  });

  test("close button exists and clickable", async () => {
    const closeModal = jest.fn();
    mockModal.mockReturnValue({ closeModal });

    render(<ImageSearchModal onSelect={jest.fn()} />);
    const closeBtn = screen.getByTestId("close-icon");
    expect(closeBtn).toBeInTheDocument();

    await userEvent.click(closeBtn);
    expect(closeModal).toHaveBeenCalled();
  });

  test("selecting image calls onSelect and closes modal", async () => {
    const closeModal = jest.fn();
    const onSelect = jest.fn();
    mockModal.mockReturnValue({ closeModal });

    render(<ImageSearchModal onSelect={onSelect} />);
    await userEvent.click(screen.getByText("Select Image"));

    expect(onSelect).toHaveBeenCalledWith("img.jpg");
    expect(closeModal).toHaveBeenCalled();
  });

  test("typing in search triggers onSearch and updates URL params", async () => {
    const setSearchParams = jest.fn();
    mockUseSearchParams.mockReturnValue([{ get: () => "" }, setSearchParams]);

    render(<ImageSearchModal onSelect={jest.fn()} />);
    await userEvent.click(screen.getByText("Search"));

    expect(setSearchParams).toHaveBeenCalled();
  });
});
