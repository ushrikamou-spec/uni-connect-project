// Shared counselling rules. No database imports, so it is safe anywhere.

export const SLOT_MINUTES = 30;
export const BOOKING_WINDOW_DAYS = 14; // students can book tomorrow .. +14 days

export const STATUSES = ["Pending", "Approved", "On hold", "Rejected"] as const;
export type Status = (typeof STATUSES)[number];

// Statuses a counsellor is allowed to set.
export const COUNSELLOR_STATUSES: Status[] = ["Approved", "On hold", "Rejected"];

const pad = (n: number) => String(n).padStart(2, "0");

export function toMinutes(time: string) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
}

export function fromMinutes(total: number) {
    return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

// 30-minute slots between office start and end, e.g. "09:00" to "12:00".
export function generateSlots(officeStart: string, officeEnd: string) {
    const slots: { start: string; end: string }[] = [];
    const last = toMinutes(officeEnd);
    for (let m = toMinutes(officeStart); m + SLOT_MINUTES <= last; m += SLOT_MINUTES) {
        slots.push({ start: fromMinutes(m), end: fromMinutes(m + SLOT_MINUTES) });
    }
    return slots;
}

export function formatLocalDate(d: Date) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Dates open for booking, as "YYYY-MM-DD" (tomorrow up to the window end).
export function upcomingDates() {
    const now = new Date();
    const dates: string[] = [];
    for (let i = 1; i <= BOOKING_WINDOW_DAYS; i++) {
        dates.push(
            formatLocalDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + i))
        );
    }
    return dates;
}

// 0 = Sunday ... 6 = Saturday
export function weekdayOf(date: string) {
    const [y, m, d] = date.split("-").map(Number);
    return new Date(y, m - 1, d).getDay();
}

export function initialsOf(name: string) {
    return name
        .replace(/^(dr|mr|ms|mrs|prof)\.?\s+/i, "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");
}