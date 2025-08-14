import { fireEvent, screen, waitFor } from "@testing-library/react";
import QuantitySelector from "@/components/quantity-selector/QuantitySelector";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";
import typeIntoInput from "@/utils/type-into-input/typeIntoInput";

const mockOnChange = jest.fn();

const renderSelector = (props?: Partial<React.ComponentProps<typeof QuantitySelector>>) => {
  renderWithProviders(
    <QuantitySelector initialQuantity={2} onQuantityChange={mockOnChange} {...props} />
  );
};

jest.useFakeTimers();

describe("QuantitySelector", () => {
  beforeEach(() => jest.clearAllMocks());

  const getInput = () => screen.getByDisplayValue("2") as HTMLInputElement;

  test("increases quantity when add button is clicked", async () => {
    renderSelector();
    fireEvent.click(screen.getByTestId("increase-quantity-button"));
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(3);
    });
  });

  test("decreases quantity but not below minQuantity", async () => {
    renderSelector();
    fireEvent.click(screen.getByTestId("decrease-quantity-button"));
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(1);
    });
    fireEvent.click(screen.getByTestId("decrease-quantity-button"));
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
  });

  test("changes quantity via input", async () => {
    renderSelector();
    await typeIntoInput(getInput(), "5");
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(5);
    });
  });

  test("resets quantity on blur if input is zero", async () => {
    renderSelector();
    const input = getInput();
    await typeIntoInput(input, "0");
    fireEvent.blur(input);
    expect(input.value).toBe("2");
  });

  test("handles empty input gracefully", () => {
    renderSelector();
    const input = getInput();
    fireEvent.change(input, { target: { value: "" } });
    expect(input.value).toBe("");
  });

  test("disables decrease button when quantity equals minQuantity", () => {
    renderSelector({ initialQuantity: 1 });
    expect(screen.getByTestId("decrease-quantity-button")).toHaveClass("disabled");
  });
});
