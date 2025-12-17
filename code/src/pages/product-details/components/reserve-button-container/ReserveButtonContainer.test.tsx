import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ReserveButtonContainer from "@/pages/product-details/components/reserve-button-container/ReserveButtonContainer";
import ReserveButton from "@/pages/product-details/components/reserve-button/ReserveButton";
import AuthModal from "@/containers/modals/auth/AuthModal";
import { useGetMyReservationsQuery, useRemoveFromReservationsMutation } from "@/store/tanstack-api/modules/reservations";
import { useIsAuthSelector, useUserRoleSelector } from "@/store/slices/userSlice";
import { useModalContext } from "@/context/modal/ModalContext";
import useAddToReservations from "@/hooks/use-add-to-reservations/useAddToReservations";

jest.mock("@/pages/product-details/components/reserve-button/ReserveButton");
jest.mock("@/store/tanstack-api/modules/reservations");
jest.mock("@/store/slices/userSlice");
jest.mock("@/context/modal/ModalContext");
jest.mock("@/hooks/use-add-to-reservations/useAddToReservations");

const mockHandleAdd = jest.fn();
const mockRemoveMutate = jest.fn();
const mockOpenModal = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();

    (ReserveButton as jest.Mock).mockImplementation(({ isReserved, isLoading, onToggle }) => (
        <button
            data-testid="reserve-button"
            disabled={isLoading}
            data-reserved={isReserved}
            onClick={onToggle}
        >
            Reserve
        </button>
    ));

    (useIsAuthSelector as jest.Mock).mockReturnValue(true);
    (useUserRoleSelector as jest.Mock).mockReturnValue("USER");

    (useModalContext as jest.Mock).mockReturnValue({
        openModal: mockOpenModal
    });

    (useAddToReservations as jest.Mock).mockReturnValue({
        handleAddToReservations: mockHandleAdd,
        isPending: false
    });

    (useRemoveFromReservationsMutation as jest.Mock).mockReturnValue({
        mutate: mockRemoveMutate,
        isPending: false
    });

    (useGetMyReservationsQuery as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false
    });
});

const productId = "1";

describe("ReserveButtonContainer", () => {
    test("renders ReserveButton", () => {
        render(<ReserveButtonContainer productId={productId} />);
        expect(screen.getByTestId("reserve-button")).toBeInTheDocument();
    });

    test("shows reserved state when product is in reservations", () => {
        (useGetMyReservationsQuery as jest.Mock).mockReturnValue({
            data: [{ id: productId }],
            isLoading: false
        });

        render(<ReserveButtonContainer productId={productId} />);
        const btn = screen.getByTestId("reserve-button");
        expect(btn).toHaveAttribute("data-reserved", "true");
    });

    test("shows loading state when adding or removing", () => {
        (useAddToReservations as jest.Mock).mockReturnValue({
            handleAddToReservations: mockHandleAdd,
            isPending: true
        });

        render(<ReserveButtonContainer productId={productId} />);
        const btn = screen.getByTestId("reserve-button");
        expect(btn).toBeDisabled();
    });

    test("calls handleAddToReservations when product is not reserved", async () => {
        render(<ReserveButtonContainer productId={productId} />);
        const btn = screen.getByTestId("reserve-button");

        await userEvent.click(btn);

        expect(mockHandleAdd).toHaveBeenCalledWith({ productId });
        expect(mockRemoveMutate).not.toHaveBeenCalled();
        expect(mockOpenModal).not.toHaveBeenCalled();
    });

    test("calls removeMutation.mutate when product is reserved", async () => {
        (useGetMyReservationsQuery as jest.Mock).mockReturnValue({
            data: [{ id: productId }],
            isLoading: false
        });

        render(<ReserveButtonContainer productId={productId} />);
        const btn = screen.getByTestId("reserve-button");

        await userEvent.click(btn);

        expect(mockRemoveMutate).toHaveBeenCalledWith({ productId });
        expect(mockHandleAdd).not.toHaveBeenCalled();
        expect(mockOpenModal).not.toHaveBeenCalled();
    });
});
