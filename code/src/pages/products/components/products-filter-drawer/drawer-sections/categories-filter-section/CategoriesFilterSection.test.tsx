import { fireEvent, render, screen } from "@testing-library/react";

import { ProductFilterParams } from "@/types/product.types";
import { categoryProbableFilters } from "@/pages/sales/SalesPage.constants";
import CategoriesFilterSection from "@/pages/products/components/products-filter-drawer/drawer-sections/categories-filter-section/CategoriesFilterSection";

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
        onChange: (event: React.SyntheticEvent, checked: boolean) => void;
    }) => (
        <input
            type="checkbox"
            checked={props.checked}
            data-testid={`checkbox-${props.labelTranslationKey}`}
            onClick={(e) => props.onChange(e as unknown as React.SyntheticEvent, !props.checked)}
            readOnly
        />
    ),
}));

describe("CategoriesFilterSection", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders checkboxes for all categories", () => {
        render(<CategoriesFilterSection tabKey="tab" />);

        categoryProbableFilters.forEach(({ translationKey }) => {
            expect(screen.getByTestId(`checkbox-${translationKey}`)).toBeInTheDocument();
        });
    });

    test("reset button triggers resetSection", () => {
        render(<CategoriesFilterSection tabKey="tab" />);
        fireEvent.click(screen.getByTestId("reset-btn"));

        expect(mockResetSection).toHaveBeenCalledWith("tab", ["tags"]);
    });
});
