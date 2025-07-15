import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import ProductCardWithDelete from "./ProductCardWithDelete";

const productId = "123";
const mockDeleteViewProduct = jest.fn();

jest.mock("@/store/api/viewHistoryApi", () => ({
  useDeleteViewProductMutation: () => [mockDeleteViewProduct]
}));

describe("ProductCardWithDelete", () => {
  beforeEach(() => {
    render(
      <ProductCardWithDelete productId={productId}>
        <div>Product Content</div>
      </ProductCardWithDelete>
    );
  });

  test("renders children and delete button", () => {
    const children = screen.getByText("Product Content");
    const deleteButton = screen.getByRole("button");

    expect(children).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  test("calls deleteViewProduct with productId on delete button click", async () => {
    const deleteButton = screen.getByRole("button");

    await userEvent.click(deleteButton);
    expect(mockDeleteViewProduct).toHaveBeenCalledWith(productId);
  });
});
