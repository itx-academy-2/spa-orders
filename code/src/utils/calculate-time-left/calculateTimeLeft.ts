import { EXPIRATION_HOURS } from "@/constants/reservations";

export type TimeLeft = {
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
};

export const calculateTimeLeft = (addedAt: string): TimeLeft => {
    const now = Date.now();
    const reserveTime = new Date(addedAt).getTime();
    const expiresAt = reserveTime + EXPIRATION_HOURS * 60 * 60 * 1000;

    const diff = Math.max(0, expiresAt - now);

    const expired = diff === 0;

    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { hours, minutes, seconds, expired };
};

export const formatTimeLeft = (time: TimeLeft): string =>
    time.expired
        ? "reservationsTable.expired"
        : `${time.hours.toString().padStart(2, "0")}:${time.minutes
            .toString()
            .padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")}`;
