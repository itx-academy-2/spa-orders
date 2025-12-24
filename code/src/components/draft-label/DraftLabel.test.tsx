import { render, screen } from "@testing-library/react";
import DraftLabel from "@/components/draft-label/DraftLabel";

describe("DraftLabel", () => {
    test("renders the DraftLabel container", () => {
        render(<DraftLabel />);
        expect(screen.getByTestId("draft-label")).toBeInTheDocument();
    });

    test("renders the translation text", () => {
        render(<DraftLabel />);
        const container = screen.getByTestId("draft-label");
        expect(container).toHaveTextContent("productsTable.label.draft");
    });

    test("has the correct class", () => {
        render(<DraftLabel />);
        const container = screen.getByTestId("draft-label");
        expect(container).toHaveClass("draft-label");
    });
});
