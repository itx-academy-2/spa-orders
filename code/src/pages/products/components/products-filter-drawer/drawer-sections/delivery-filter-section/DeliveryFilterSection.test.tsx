import { render, screen, fireEvent } from "@testing-library/react";

import { ProductFilterParams } from "@/types/product.types";
import DeliverySection from "@/pages/products/components/products-filter-drawer/drawer-sections/delivery-filter-section/DeliveryFilterSection";

const mockResetSection = jest.fn();

jest.mock("@/store/zustand/filtersStore", () => ({
    useFiltersStore: (selector: (store: {
        drafts: Record<string, ProductFilterParams>;
        resetSection: (tabKey: string, keys: (keyof ProductFilterParams)[]) => void;
    }) => unknown) => selector({
        drafts: {},
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
        disabled?: boolean;
    }) => (
        <input
            type="checkbox"
            checked={props.checked}
            data-testid={`checkbox-${props.labelTranslationKey}`}
            readOnly
        />
    ),
}));

describe("DeliverySection", () => {
    const fullDraft: ProductFilterParams = {
        availability: true,
        nonAvailability: false,
        tags: ["computers"],
        discount: true,
        nonDiscount: true,
        deliveryNovaPost: true,
        deliveryUkrPost: false,
        priceMin: 0,
        priceMax: 1000,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders checkboxes with draft values", () => {
        render(<DeliverySection tabKey="tab" draft={fullDraft} />);

        expect(screen.getByTestId("checkbox-productsFilter.deliveryUkrPost")).not.toBeChecked();
        expect(screen.getByTestId("checkbox-productsFilter.deliveryNovaPost")).toBeChecked();
    });

    test("computes isFilterActive correctly", () => {
        render(<DeliverySection tabKey="tab" draft={fullDraft} />);
        expect(screen.getByTestId("is-active")).toHaveTextContent("true");

        render(<DeliverySection tabKey="tab" draft={{ ...fullDraft, deliveryUkrPost: true, deliveryNovaPost: true }} />);
        const list = screen.getAllByTestId("is-active");
        expect(list[list.length - 1]).toHaveTextContent("false");
    });

    test("reset button triggers resetSection", () => {
        render(<DeliverySection tabKey="tab" draft={fullDraft} />);
        fireEvent.click(screen.getByTestId("reset-btn"));

        expect(mockResetSection).toHaveBeenCalledWith("tab", ["deliveryUkrPost", "deliveryNovaPost"]);
    });
});
