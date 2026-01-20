import { render, screen } from "@testing-library/react";

import ReservedLabel from "@/components/reserved-label/ReservedLabel";

describe("ReservedLabel", () => {
    test("renders the ReservedLabel container", () => {
        render(<ReservedLabel />);
        expect(screen.getByTestId("reserved-label")).toBeInTheDocument();
    });

    test("renders the translation text", () => {
        render(<ReservedLabel />);
        const container = screen.getByTestId("reserved-label");
        expect(container).toHaveTextContent("productsTable.label.reservedLabel");
    });
});
