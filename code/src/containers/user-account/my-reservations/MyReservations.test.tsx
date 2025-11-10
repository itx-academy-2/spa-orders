import { render, screen } from "@testing-library/react";
import { useSearchParams } from "react-router-dom";

import MyReservations from "@/containers/user-account/my-reservations/MyReservations";

const mockedUseSearchParams = useSearchParams as jest.Mock;

jest.mock("react-router-dom", () => {
    const actual = jest.requireActual("react-router-dom");
    return {
        ...actual,
        useSearchParams: jest.fn(),
    };
});

const renderAndMock = ({ mockSortOption }: { mockSortOption?: string } = {}) => {
    const searchParams = new URLSearchParams();
    if (mockSortOption) searchParams.set("sort", mockSortOption);

    const setParams = jest.fn();
    mockedUseSearchParams.mockReturnValue([searchParams, setParams]);

    render(<MyReservations />);

    return {
        setParams,
        searchParams,
    };
};

describe("MyReservations Page", () => {
    test("renders the title typography", () => {
        renderAndMock();

        expect(screen.getByText("MyReservations.title")).toBeInTheDocument();
    });

    test("renders count of products", () => {
        renderAndMock();

        expect(screen.getByText(/MyReservations\.productsCount/i)).toBeInTheDocument();
    });

    test("renders dropdown component", () => {
        renderAndMock();

        expect(screen.getByTestId("app-dropdown")).toBeInTheDocument();
    });
});