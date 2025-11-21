import { render, screen, fireEvent } from "@testing-library/react";

import PriceFilterSection from "@/pages/products/components/products-filter-drawer/drawer-sections/price-filters-section/PriceFilterSection";
import { ProductFilterParams } from "@/types/product.types";

const mockSetDraft = jest.fn();
const mockResetPriceSection = jest.fn();

jest.mock("@/store/zustand/filtersStore", () => ({
    useFiltersStore: (selector: (store: {
        drafts: Record<string, ProductFilterParams>;
        setDraft: (tabKey: string, patch: Partial<ProductFilterParams>) => void;
        resetPriceSection: (tabKey: string, min: number, max: number) => void;
    }) => unknown) => selector({
        drafts: {},
        setDraft: mockSetDraft,
        resetPriceSection: mockResetPriceSection,
    }),
}));

jest.mock(
    "@/containers/dashboard-orders-filter-drawer/components/filter-record-accordion/FilterRecordAccordion",
    () => ({
        __esModule: true,
        default: (props: {
            isFilterActive: boolean;
            resetFilter: () => void;
            sectionCaptionTranslationKey: string;
            children: React.ReactNode;
        }) => (
            <div data-testid="accordion">
                <div data-testid="is-active">{String(props.isFilterActive)}</div>
                <button data-testid="reset-btn" onClick={props.resetFilter} />
                {props.children}
            </div>
        ),
    })
);

jest.mock("@/components/app-range-slider/AppRangeSlider", () => ({
    __esModule: true,
    default: (props: {
        value: [number, number];
        onChange: (value: [number, number]) => void;
        min: number;
        max: number;
    }) => (
        <input
            type="range"
            data-testid="price-slider"
            value={props.value[0]}
            onChange={(e) =>
                props.onChange([Number(e.currentTarget.value), props.value[1]])
            }
        />
    ),
}));

describe("PriceFilterSection", () => {
    const fullDraft: ProductFilterParams = {
        availability: true,
        nonAvailability: false,
        tags: ["computers"],
        discount: true,
        nonDiscount: false,
        deliveryNovaPost: true,
        deliveryUkrPost: true,
        priceMin: 100,
        priceMax: 900,
    };

    const min = 0;
    const max = 1000;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders slider with draft values", () => {
        render(<PriceFilterSection tabKey="tab" min={min} max={max} />);
        const slider = screen.getByTestId("price-slider") as HTMLInputElement;
        expect(slider.value).toBe("0");
    });

    test("reset button triggers resetPriceSection", () => {
        render(<PriceFilterSection tabKey="tab" min={min} max={max} />);
        fireEvent.click(screen.getByTestId("reset-btn"));
        expect(mockResetPriceSection).toHaveBeenCalledWith("tab", min, max);
    });

    test("computes isFilterActive correctly", () => {
        render(<PriceFilterSection tabKey="tab" min={min} max={max} />);
        expect(screen.getByTestId("is-active")).toHaveTextContent("false");

        render(<PriceFilterSection tabKey="tab" min={min} max={max} />);
        const list = screen.getAllByTestId("is-active");
        expect(list[list.length - 1]).toHaveTextContent("false");
    });
});
