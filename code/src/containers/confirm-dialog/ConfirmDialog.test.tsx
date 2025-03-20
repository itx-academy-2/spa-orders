import { fireEvent, render, screen } from "@testing-library/react";

import ConfirmDialog from "@/containers/confirm-dialog/ConfirmDialog";
import { ConfirmDialogProps } from "@/containers/confirm-dialog/ConfirmDialog.types";

jest.mock("react-intl", () => ({
  useIntl: () => ({ formatMessage: (props: { id: string }) => props.id })
}));

const mockOnCancel = jest.fn();
const mockOnConfirm = jest.fn();
const mockOnClose = jest.fn();

const renderComponent = (props: Partial<ConfirmDialogProps> = {}) => {
  const defaultProps: ConfirmDialogProps = {
    isOpen: true,
    onCancel: mockOnCancel,
    onConfirm: mockOnConfirm,
    onClose: mockOnClose,
    title: "confirmDialog.title",
    subtitle: "confirmDialog.subtitle"
  };

  return render(<ConfirmDialog {...defaultProps} {...props} />);
};

describe("ConfirmDialog", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should render the dialog with title and subtitle", () => {
    renderComponent();

    const title = screen.getByText("confirmDialog.title");
    const subtitle = screen.getByText("confirmDialog.subtitle");

    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
  });

  test("should call onCancel when cancel button is clicked", () => {
    renderComponent();

    const cancelButton = screen.getByText("confirmDialog.cancel");
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test("should call onConfirm when confirm button is clicked", () => {
    renderComponent();

    const confirmButton = screen.getByText("confirmDialog.confirm");
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  test("should call onClose when dialog is closed", () => {
    renderComponent();

    const backdrope = screen.getByTestId("confirm-dialog-backdrope");
    fireEvent.click(backdrope);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("should not render subtitle if not provided", () => {
    renderComponent({ subtitle: undefined });

    const subtitle = screen.queryByText("confirmDialog.subtitle");

    expect(subtitle).not.toBeInTheDocument();
  });

  test("should render custom button texts if provided", () => {
    renderComponent({
      cancelButtonText: "customCancel",
      confirmButtonText: "customConfirm"
    });

    const cancelButton = screen.getByText("customCancel");
    const confirmButton = screen.getByText("customConfirm");

    expect(cancelButton).toBeInTheDocument();
    expect(confirmButton).toBeInTheDocument();
  });
});
