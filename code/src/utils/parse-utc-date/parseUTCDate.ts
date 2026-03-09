export function parseUTCDate(isoString: string): Date {
    if (!isoString) {
        throw new Error("Invalid date string");
    }

    // Keep only the first 3 digits of milliseconds for valid ISO format
    const normalized = isoString.replace(/\.(\d{3})\d*/, '.$1');

    const utcString = normalized.endsWith('Z') ? normalized : normalized + 'Z';

    const date = new Date(utcString);

    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date after normalization: ${isoString}`);
    }

    return date;
}