import { render, screen, fireEvent } from "@testing-library/react";
import SuggestedKeywords from "@/containers/modals/image-search-modal/components/suggested-keywords/SuggestedKeywords";

describe("SuggestedKeywords", () => {
    test("renders all provided keywords", () => {
        const keywords = ["laptop", "smartphone"];
        const onKeywordClick = jest.fn();

        render(<SuggestedKeywords keywords={keywords} onKeywordClick={onKeywordClick} />);

        // each keyword should be rendered
        expect(screen.getByText("laptop")).toBeInTheDocument();
        expect(screen.getByText("smartphone")).toBeInTheDocument();
    });

    test("calls onKeywordClick with correct keyword when a keyword is clicked", () => {
        const keywords = ["laptop", "smartphone"];
        const onKeywordClick = jest.fn();

        render(<SuggestedKeywords keywords={keywords} onKeywordClick={onKeywordClick} />);

        const laptopNode = screen.getByText("laptop");
        fireEvent.click(laptopNode);

        expect(onKeywordClick).toHaveBeenCalledTimes(1);
        expect(onKeywordClick).toHaveBeenCalledWith("laptop");
    });

    test("does not render any keyword when keywords array is empty", () => {
        const keywords: string[] = [];
        const onKeywordClick = jest.fn();

        const { container } = render(<SuggestedKeywords keywords={keywords} onKeywordClick={onKeywordClick} />);

        expect(screen.queryByText("laptop")).not.toBeInTheDocument();
        expect(screen.queryByText("smartphone")).not.toBeInTheDocument();
        /*
        * The wrapper should be rendered, but it must contain no keyword items.
        * This verifies that no child elements with text content are present.
        */
        const textNodes = Array.from(container.querySelectorAll("div")).filter((n) => n.textContent?.trim());
        expect(textNodes.length).toBe(0);
    });
});
