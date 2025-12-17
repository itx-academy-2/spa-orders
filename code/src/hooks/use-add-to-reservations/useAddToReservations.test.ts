import { renderHook, act } from "@testing-library/react";

import useAddToReservations from "@/hooks/use-add-to-reservations/useAddToReservations";
import { useAddToReservationsMutation } from "@/store/tanstack-api/modules/reservations";
import useSnackbar from "@/hooks/use-snackbar/useSnackbar";

import { ReservationProductParams } from "@/types/product.types";

jest.mock("@/store/tanstack-api/modules/reservations");
jest.mock("@/hooks/use-snackbar/useSnackbar");

const mockOpenSnackbarWithTimeout = jest.fn();
const mockMutateAsync = jest.fn();

const mockParams: ReservationProductParams = {
  productId: "1"
};

describe("useAddToReservations", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useSnackbar as jest.Mock).mockReturnValue({
      openSnackbarWithTimeout: mockOpenSnackbarWithTimeout
    });

    (useAddToReservationsMutation as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isLoading: false
    });
  });

  test("shows success snackbar on successful reservation", async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAddToReservations());

    await act(async () => {
      await result.current.handleAddToReservations(mockParams);
    });

    expect(mockMutateAsync).toHaveBeenCalledWith(mockParams);
    expect(mockOpenSnackbarWithTimeout).toHaveBeenCalledWith({
      variant: "success",
      messageTranslationKey: "reservations.add.success"
    });
  });

  test("shows generic error snackbar when error has no data", async () => {
    mockMutateAsync.mockRejectedValueOnce({ status: 500 });

    const { result } = renderHook(() => useAddToReservations());

    await act(async () => {
      await result.current.handleAddToReservations(mockParams);
    });

    expect(mockOpenSnackbarWithTimeout).toHaveBeenCalledWith({
      variant: "error",
      messageTranslationKey: "reservations.add.fail"
    });
  });

  test("shows limit exceeded error when API returns Reservation Limit Exceeded", async () => {
    mockMutateAsync.mockRejectedValueOnce({
      status: 400,
      data: {
        status: 400,
        title: "Reservation Limit Exceeded"
      }
    });

    const { result } = renderHook(() => useAddToReservations());

    await act(async () => {
      await result.current.handleAddToReservations(mockParams);
    });

    expect(mockOpenSnackbarWithTimeout).toHaveBeenCalledWith({
      variant: "error",
      messageTranslationKey: "reservations.add.limit.exceeded"
    });
  });

  test("shows total cost exceeded error when API returns Reservation Total Cost Exceeded", async () => {
    mockMutateAsync.mockRejectedValueOnce({
      status: 400,
      data: {
        status: 400,
        title: "Reservation Total Cost Exceeded"
      }
    });

    const { result } = renderHook(() => useAddToReservations());

    await act(async () => {
      await result.current.handleAddToReservations(mockParams);
    });

    expect(mockOpenSnackbarWithTimeout).toHaveBeenCalledWith({
      variant: "error",
      messageTranslationKey: "reservations.add.totalCost.exceeded"
    });
  });

  test("shows generic error for unknown 400 error title", async () => {
    mockMutateAsync.mockRejectedValueOnce({
      status: 400,
      data: {
        status: 400,
        title: "Some Unknown Error"
      }
    });

    const { result } = renderHook(() => useAddToReservations());

    await act(async () => {
      await result.current.handleAddToReservations(mockParams);
    });

    expect(mockOpenSnackbarWithTimeout).toHaveBeenCalledWith({
      variant: "error",
      messageTranslationKey: "reservations.add.fail"
    });
  });

  test("shows generic error for non-400 API errors", async () => {
    mockMutateAsync.mockRejectedValueOnce({
      status: 500,
      data: {
        status: 500,
        title: "Internal Server Error"
      }
    });

    const { result } = renderHook(() => useAddToReservations());

    await act(async () => {
      await result.current.handleAddToReservations(mockParams);
    });

    expect(mockOpenSnackbarWithTimeout).toHaveBeenCalledWith({
      variant: "error",
      messageTranslationKey: "reservations.add.fail"
    });
  });
});
