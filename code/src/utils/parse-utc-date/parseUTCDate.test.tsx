import { parseUTCDate } from "./parseUTCDate";

describe("parseUTCDate", () => {
    test("returns valid Date for correct ISO string with Z", () => {
        const iso = "2026-03-10T12:34:56.123Z";
        const date = parseUTCDate(iso);
        expect(date.toISOString()).toBe("2026-03-10T12:34:56.123Z");
    });

    test("returns valid Date for ISO string without Z (adds Z)", () => {
        const iso = "2026-03-10T12:34:56.123";
        const date = parseUTCDate(iso);
        expect(date.toISOString()).toBe("2026-03-10T12:34:56.123Z");
    });

    test("trims milliseconds to 3 digits", () => {
        const iso = "2026-03-10T12:34:56.123456";
        const date = parseUTCDate(iso);
        expect(date.getMilliseconds()).toBe(123);
    });

    test("returns Invalid Date for empty string", () => {
        const date = parseUTCDate("");
        expect(date.toString()).toBe("Invalid Date");
    });

    test("returns Invalid Date for invalid string", () => {
        const date = parseUTCDate("not a date");
        expect(date.toString()).toBe("Invalid Date");
    });

    test("remains valid for ISO with exactly 3 milliseconds digits", () => {
        const iso = "2026-03-10T12:34:56.999Z";
        const date = parseUTCDate(iso);
        expect(date.toISOString()).toBe("2026-03-10T12:34:56.999Z");
    });
});