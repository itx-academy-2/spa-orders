import { calculateTimeLeft, formatTimeLeft, TimeLeft } from "@/utils/calculate-time-left/calculateTimeLeft";
import { EXPIRATION_HOURS } from "@/constants/reservations";

describe("calculateTimeLeft", () => {
    beforeAll(() => {
        jest.spyOn(global.Date, "now").mockImplementation(() =>
            new Date("2025-01-01T12:00:00Z").getTime()
        );
    });

    afterAll(() => {
        jest.spyOn(global.Date, "now").mockRestore();
    });

    test("calculates correct time left when not expired", () => {
        const addedAt = "2025-01-01T10:00:00Z";
        const timeLeft: TimeLeft = calculateTimeLeft(addedAt);

        expect(timeLeft.expired).toBe(false);
        expect(timeLeft.hours).toBe(EXPIRATION_HOURS - 2);
        expect(timeLeft.minutes).toBe(0);
        expect(timeLeft.seconds).toBe(0);
    });

    test("returns expired=true when time is past expiration", () => {
        const pastTime = new Date(Date.now() - (EXPIRATION_HOURS + 1) * 60 * 60 * 1000);
        const addedAt = pastTime.toISOString();

        const timeLeft: TimeLeft = calculateTimeLeft(addedAt);

        expect(timeLeft.expired).toBe(true);
        expect(timeLeft.hours).toBe(0);
        expect(timeLeft.minutes).toBe(0);
        expect(timeLeft.seconds).toBe(0);
    });

    test("calculates minutes and seconds correctly", () => {
        const targetDiffMs = (1 * 60 * 60 + 30 * 60 + 45) * 1000;
        const addedAtDate = new Date(Date.now() - (EXPIRATION_HOURS * 60 * 60 * 1000 - targetDiffMs));
        const addedAt = addedAtDate.toISOString();

        const timeLeft: TimeLeft = calculateTimeLeft(addedAt);

        expect(timeLeft.expired).toBe(false);
        expect(timeLeft.hours).toBe(1);
        expect(timeLeft.minutes).toBe(30);
        expect(timeLeft.seconds).toBe(45);
    });
});

describe("formatTimeLeft", () => {
    test("formats as HH:MM:SS when not expired", () => {
        const time: TimeLeft = { hours: 2, minutes: 5, seconds: 9, expired: false };
        expect(formatTimeLeft(time)).toBe("02:05:09");
    });

    test("returns expired translation key when expired", () => {
        const time: TimeLeft = { hours: 0, minutes: 0, seconds: 0, expired: true };
        expect(formatTimeLeft(time)).toBe("reservationsTable.expired");
    });
});
