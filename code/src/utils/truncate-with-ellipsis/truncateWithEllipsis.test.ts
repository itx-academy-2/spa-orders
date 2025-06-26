import truncateWithEllipsis from "@/utils/truncate-with-ellipsis/truncateWithEllipsis";

const mockTexts = {
  text25: "Lorem ipsum dolor sitamet",
  text30: "Lorem ipsum dolor sitamet elit",
  textWithSpaces: "Lorem ipsum dolor         "
};

describe("truncateWithEllipsis", () => {
  it("should show text without ellipsis", () => {
    expect(truncateWithEllipsis(mockTexts.text25)).toEqual(mockTexts.text25);
  });

  it("should show text without ellipsis with custom length", () => {
    expect(truncateWithEllipsis(mockTexts.text30, 30)).toEqual(
      mockTexts.text30
    );
  });

  it("should show text with ellipsis", () => {
    expect(truncateWithEllipsis(mockTexts.text30)).toEqual(
      "Lorem ipsum dolor sitamet…"
    );
  });

  it("should remove space before adding ellipsis", () => {
    expect(truncateWithEllipsis(mockTexts.textWithSpaces)).toEqual(
      "Lorem ipsum dolor…"
    );
  });
});
