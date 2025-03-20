import { fireEvent, render, renderHook, screen } from "@testing-library/react";

import {
  ConfirmProvider,
  useConfirmContext
} from "@/context/confirm/ConfirmContext";

const onConfirm = jest.fn();
const onCancel = jest.fn();

const TestComponent = () => {
  const { openConfirm, closeConfirm, isOpen } = useConfirmContext();

  return (
    <div>
      <button
        onClick={() =>
          openConfirm({
            mainText: "Are you sure?",
            secondaryText: "This action is irreversible.",
            onConfirm: onConfirm,
            onCancel: onCancel,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel"
          })
        }
      >
        Open Confirm
      </button>
      <button onClick={closeConfirm}>Close Confirm</button>
      {isOpen && <span>Confirm Dialog is Open</span>}
    </div>
  );
};

describe("ConfirmContext", () => {
  beforeEach(() => {
    render(
      <ConfirmProvider>
        <TestComponent />
      </ConfirmProvider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const openConfirmModal = () => {
    const openButton = screen.getByText("Open Confirm");
    fireEvent.click(openButton);
  };

  test("should open confirm dialog", () => {
    openConfirmModal();

    const confirmTitleWhenOpen = screen.getByText("Confirm Dialog is Open");

    expect(confirmTitleWhenOpen).toBeInTheDocument();
  });

  test("should close confirm dialog", () => {
    openConfirmModal();

    const confirmTitleWhenOpen = screen.getByText("Confirm Dialog is Open");

    expect(confirmTitleWhenOpen).toBeInTheDocument();

    const closeButton = screen.getByText("Close Confirm");
    fireEvent.click(closeButton);

    const confirmTitleWhenClosed = screen.queryByText("Confirm Dialog is Open");

    expect(confirmTitleWhenClosed).not.toBeInTheDocument();
  });

  test("should call onConfirm callback", () => {
    openConfirmModal();

    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    expect(onConfirm).toHaveBeenCalled();
  });

  test("should call onCancel callback", () => {
    openConfirmModal();

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  describe("useConfirmContext", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("throws an error when context in not within a provider", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});

      const msg = "useConfirmContext must be used within a ConfirmProvider";

      const renderConfirmHook = () => renderHook(() => useConfirmContext());

      expect(renderConfirmHook).toThrow(msg);
    });
  });
});
