import { screen } from "@testing-library/react";

import ProductsTable from "@/containers/tables/products-table/ProductsTable";
import {
  mockProducts,
  productsTableColumns
} from "@/containers/tables/products-table/ProductsTable.constants";

import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

describe("Test ProductsTable", () => {
  test("Should be rendered correctly", () => {
    const { container } = renderWithProviders(
      <ProductsTable products={mockProducts} />
    );

    productsTableColumns
      .filter((item) => item)
      .forEach((columnTitle) => {
        const columnElement = screen.getByText(columnTitle);
        expect(columnElement).toBeInTheDocument();
      });

    const tableCells = screen.getAllByRole("cell");

    const bodyElement = container.querySelector(".products-table__body");
    const containerElement = container.querySelector(".products-table");

    const expectedNumberOfCells = 10 * 2;

    expect(tableCells.length).toBe(expectedNumberOfCells);
    expect(bodyElement).toBeInTheDocument();
    expect(containerElement).toBeInTheDocument();
  });

  test("Should render fallback", () => {
    renderWithProviders(<ProductsTable products={[]} />);

    const fallbackText = screen.getByText(/productsTable.fallback/);
    expect(fallbackText).toBeInTheDocument();

    const fallBackContainer = screen.getByTestId("table-fallback");
    expect(fallBackContainer).toHaveClass("products-table__fallback");
  });
});
