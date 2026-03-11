import { DateTime, Duration } from "luxon";
import { calculateTimeLeft, formatTimeLeft } from "./calculateTimeLeft";
import { EXPIRATION_HOURS } from "@/constants/reservations";

describe("calculateTimeLeft", () => {
    const now = DateTime.utc();

    test("returns Duration for a future time", () => {
        const addedAt = now.minus({ hours: 1 }).toISO();
        const duration = calculateTimeLeft(addedAt!);

        expect(duration).toBeInstanceOf(Duration);
        expect(duration?.as("milliseconds")).toBeGreaterThan(0);
    });

    test("returns Duration of 0 for a past time", () => {
        const addedAt = now.minus({ hours: EXPIRATION_HOURS + 1 }).toISO();
        const duration = calculateTimeLeft(addedAt!);

        expect(duration?.as("milliseconds")).toBe(0);
    });

    test("returns null for an invalid date", () => {
        const duration = calculateTimeLeft("not-a-date");
        expect(duration).toBeNull();
    });
});

describe("formatTimeLeft", () => {
    test("formats Duration to hh:mm:ss", () => {
        const duration = Duration.fromObject({ hours: 2, minutes: 5, seconds: 9 });
        expect(formatTimeLeft(duration)).toBe("02:05:09");
    });

    test("returns 'Expired' for Duration of 0", () => {
        const duration = Duration.fromMillis(0);
        expect(formatTimeLeft(duration)).toBe("Expired");
    });

    test("returns 'Invalid time' for null", () => {
        expect(formatTimeLeft(null)).toBe("Invalid time");
    });

    test("truncates fractional seconds correctly", () => {
        const duration = Duration.fromObject({ hours: 1, minutes: 2, seconds: 59.7 });
        expect(formatTimeLeft(duration)).toBe("01:02:59");
    });
});