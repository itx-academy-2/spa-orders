import { render, screen, fireEvent } from "@testing-library/react";

import DiscountFilterSection from "@/pages/products/components/products-filter-drawer/drawer-sections/discount-filter-section/DiscountFilterSection";
import { ProductFilterParams } from "@/types/product.types";

const mockSetDraft = jest.fn();
const mockResetSection = jest.fn();

jest.mock("@/store/zustand/filtersStore", () => ({
    useFiltersStore: (selector: (store: {
        drafts: Record<string, ProductFilterParams>;
        setDraft: (tabKey: string, patch: Partial<ProductFilterParams>) => void;
        resetSection: (tabKey: string, keys: (keyof ProductFilterParams)[]) => void;
    }) => unknown) => selector({
        drafts: {},
        setDraft: mockSetDraft,
        resetSection: mockResetSection,
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

jest.mock("@/components/app-checkbox/AppCheckbox", () => ({
    __esModule: true,
    default: (props: {
        checked: boolean;
        labelTranslationKey: string;
        onChange?: (event: React.SyntheticEvent, checked: boolean) => void;
    }) => (
        <input
            type="checkbox"
            checked={props.checked}
            data-testid={`checkbox-${props.labelTranslationKey}`}
            onClick={(e) => props.onChange?.(e as unknown as React.SyntheticEvent, !props.checked)}
            readOnly
        />
    ),
}));

describe("DiscountFilterSection", () => {
    const fullDraft: ProductFilterParams = {
        availability: true,
        nonAvailability: false,
        tags: ["computers"],
        discount: true,
        nonDiscount: false,
        deliveryNovaPost: true,
        deliveryUkrPost: true,
        priceMin: 0,
        priceMax: 1000,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders checkboxes with draft values", () => {
        render(<DiscountFilterSection tabKey="tab" draft={fullDraft} />);

        expect(screen.getByTestId("checkbox-productsFilter.discounted")).toBeChecked();
        expect(screen.getByTestId("checkbox-productsFilter.nonDiscounted")).not.toBeChecked();
    });

    test("calls setDraft on checkbox change", () => {
        const draft = { ...fullDraft, discount: false };

        render(<DiscountFilterSection tabKey="tab" draft={draft} />);

        fireEvent.click(screen.getByTestId("checkbox-productsFilter.discounted"));

        expect(mockSetDraft).toHaveBeenCalledWith("tab", { discount: true });
    });

    test("reset button triggers resetSection", () => {
        render(<DiscountFilterSection tabKey="tab" draft={fullDraft} />);

        fireEvent.click(screen.getByTestId("reset-btn"));

        expect(mockResetSection).toHaveBeenCalledWith("tab", ["discount", "nonDiscount"]);
    });

    test("computes isFilterActive correctly", () => {
        render(<DiscountFilterSection tabKey="tab" draft={fullDraft} />);
        expect(screen.getByTestId("is-active")).toHaveTextContent("true");

        render(<DiscountFilterSection tabKey="tab" draft={{ ...fullDraft, discount: true, nonDiscount: true }} />);
        const list = screen.getAllByTestId("is-active");
        expect(list[list.length - 1]).toHaveTextContent("false");
    });
});
