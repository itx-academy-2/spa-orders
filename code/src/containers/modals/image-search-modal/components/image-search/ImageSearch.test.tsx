import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageSearch from "@/containers/modals/image-search-modal/components/image-search/ImageSearch";
import { useGetManagerImageSearchQuery } from "@/store/tanstack-api/modules/products/queries";
import { useModalContext } from "@/context/modal/ModalContext";
import getImageSearchStatus from "@/utils/get-image-seach-status/getImageSearchStatus";

jest.mock("@/components/app-typography/AppTypography", () => {
    return {
        __esModule: true,
        default: (props: unknown) => {
            const p = props as { children?: React.ReactNode; translationKey?: string };
            return <span>{p.translationKey ?? p.children}</span>;
        }
    };
});

jest.mock("@/components/app-button/AppButton", () => {
    return {
        __esModule: true,
        default: (props: unknown) => {
            const p = props as { children?: React.ReactNode } & Record<string, unknown>;
            const { children, ...rest } = p;
            return <button {...(rest as JSX.IntrinsicElements["button"])}>{children as React.ReactNode}</button>;
        }
    };
});

jest.mock("@/components/app-box/AppBox", () => {
    return {
        __esModule: true,
        default: (props: unknown) => {
            const p = props as { children?: React.ReactNode } & Record<string, unknown>;
            const { children, ...rest } = p;
            return <div {...(rest as JSX.IntrinsicElements["div"])}>{children as React.ReactNode}</div>;
        }
    };
});

jest.mock("@/components/app-loader/AppLoader", () => {
    return {
        __esModule: true,
        default: () => <div>Loader</div>
    };
});

jest.mock("@/components/app-search-input/AppSearchInput", () => {
    return {
        __esModule: true,
        default: (props: {
            value?: string;
            placeholder?: string;
            onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
            onClear?: () => void;
            onSearch?: () => void;
        }) => {
            const { value = "", placeholder, onChange, onClear, onSearch } = props;
            return (
                <div>
                    <input
                        role="textbox"
                        value={value}
                        placeholder={placeholder}
                        onChange={onChange}
                    />
                    <button type="button" onClick={onClear}>Clear</button>
                    <button type="button" onClick={onSearch}>Search</button>
                </div>
            );
        }
    };
});

jest.mock("@/containers/modals/image-search-modal/components/image-grid/ImageGrid", () => {
    return {
        __esModule: true,
        default: (props: {
            images: { url: string }[];
            selectedImage?: string | null;
            onSelect: (url: string) => void;
        }) => {
            const { images, onSelect } = props;
            return (
                <div data-testid="mock-image-grid">
                    {images.map((img) => (
                        <button
                            key={img.url}
                            data-testid={`mock-img-${img.url}`}
                            onClick={() => onSelect(img.url)}
                        >
                            {img.url}
                        </button>
                    ))}
                </div>
            );
        }
    };
});

jest.mock("@/context/modal/ModalContext");
jest.mock("@/store/tanstack-api/modules/products/queries");
jest.mock("@/utils/get-image-seach-status/getImageSearchStatus");
jest.mock("react-intl", () => ({
    useIntl: () => ({ formatMessage: (msg: { id: string }) => msg.id })
}));

const mockQuery = useGetManagerImageSearchQuery as jest.Mock;
const mockModal = useModalContext as jest.Mock;
const mockStatus = getImageSearchStatus as jest.Mock;

describe("ImageSearch — render states", () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
        mockModal.mockReturnValue({ closeModal: jest.fn() });
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    test("shows loader while loading", () => {
        mockQuery.mockReturnValue({ data: [], isLoading: true, error: null });
        mockStatus.mockReturnValue("");

        render(<ImageSearch onSelect={() => { }} onSearch={() => { }} />);

        expect(screen.getByText("Loader")).toBeInTheDocument();
    });

    test("shows message when provided and not loading (search status)", () => {
        mockQuery.mockReturnValue({ data: [], isLoading: false, error: null });
        mockStatus.mockReturnValue("No images");

        render(<ImageSearch onSelect={() => { }} onSearch={() => { }} />);

        const messageEl = screen.getByText("No images");
        expect(messageEl).toBeInTheDocument();
        expect(messageEl).toHaveTextContent("No images");
    });
});

describe("ImageSearch — interactions", () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    test("renders grid and lets user select image then confirm calls onSelect and closes modal", async () => {
        const images = [{ url: "a.jpg" }, { url: "b.jpg" }];

        mockQuery.mockReturnValue({ data: images, isLoading: false, error: null });
        mockStatus.mockReturnValue("");

        const onSelect = jest.fn();
        const onSearch = jest.fn();
        const closeModal = jest.fn();

        mockModal.mockReturnValue({ closeModal });

        render(<ImageSearch onSelect={onSelect} onSearch={onSearch} />);
        expect(screen.getByTestId("mock-image-grid")).toBeInTheDocument();

        const confirmBtn = screen.getByRole("button", {
            name: /searchImageModal.confirmButton/i
        });

        expect(confirmBtn).toBeDisabled();

        await userEvent.click(screen.getByTestId("mock-img-a.jpg"));

        expect(confirmBtn).toBeEnabled();

        await userEvent.click(confirmBtn);

        expect(onSelect).toHaveBeenCalledWith("a.jpg");
        expect(closeModal).toHaveBeenCalled();
    });

    test("selecting same image again toggles selection off (confirm becomes disabled)", async () => {
        const images = [{ url: "a.jpg" }];

        mockQuery.mockReturnValue({ data: images, isLoading: false, error: null });
        mockStatus.mockReturnValue("");

        const onSelect = jest.fn();
        const onSearch = jest.fn();
        const closeModal = jest.fn();

        mockModal.mockReturnValue({ closeModal });

        render(<ImageSearch onSelect={onSelect} onSearch={onSearch} />);

        const confirmBtn = screen.getByRole("button", {
            name: /searchImageModal.confirmButton/i
        });

        await userEvent.click(screen.getByTestId("mock-img-a.jpg"));
        expect(confirmBtn).toBeEnabled();

        await userEvent.click(screen.getByTestId("mock-img-a.jpg"));
        expect(confirmBtn).toBeDisabled();
    });
});

describe("ImageSearch — search behaviour", () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
        mockQuery.mockReturnValue({ data: [], isLoading: false, error: null });
        mockStatus.mockReturnValue("");
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    test("pressing Clear resets input and triggers onSearch with empty string", async () => {
        const onSelect = jest.fn();
        const onSearch = jest.fn();

        render(<ImageSearch onSelect={onSelect} onSearch={onSearch} />);

        const input = screen.getByRole("textbox");
        await userEvent.type(input, "dog");

        await userEvent.click(screen.getByRole("button", { name: "Clear" }));

        expect(onSearch).toHaveBeenCalledWith("");
        expect((input as HTMLInputElement).value).toBe("");
    });
});
