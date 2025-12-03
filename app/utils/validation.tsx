// utils/validation.ts
export type Sanitized = { ok: true; value: string } | { ok: false; error: string };

/**
 * Normalize and sanitize an email string.
 * - trims, lowercases, NFC normalizes
 * - ensures length limits
 * - returns sanitized value or error
 */
export function sanitizeEmail(raw: unknown): Sanitized {
    if (typeof raw !== "string") return { ok: false, error: "Email must be a string." };
    const s = raw.trim().normalize("NFC").toLowerCase();

    if (s.length === 0) return { ok: false, error: "Email cannot be empty." };
    if (s.length > 254) return { ok: false, error: "Email too long." };

    // Basic RFC-like email regex (practical, not perfect RFC5322)
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // allows most normal emails, rejects spaces and obvious bad forms

    if (!emailRegex.test(s)) return { ok: false, error: "Invalid email format." };

    return { ok: true, value: s };
}

/**
 * Sanitize username:
 * - trims, NFC normalizes
 * - removes control characters
 * - collapses internal whitespace to single hyphen (or remove)
 * - enforces allowed characters (letters, numbers, _ . -)
 * - enforce min/max length
 */
export function sanitizeUsername(raw: unknown, opts?: { min?: number; max?: number }): Sanitized {
    if (typeof raw !== "string") return { ok: false, error: "Username must be a string." };
    const min = opts?.min ?? 2;
    const max = opts?.max ?? 30;

    // normalize and trim
    let s = raw.trim().normalize("NFC");

    // remove invisible/control chars
    s = s.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

    // collapse internal whitespace into single hyphen (optional)
    s = s.replace(/\s+/g, "-");

    // remove any characters not in allowed set
    // allowed: letters, digits, underscore, hyphen, dot
    s = s.replace(/[^A-Za-z0-9_.-]/g, "");

    if (s.length < min) return { ok: false, error: `Username must be at least ${min} characters.` };
    if (s.length > max) return { ok: false, error: `Username must be at most ${max} characters.` };

    // defensive: don't allow usernames that are only punctuation
    if (/^[_.-]+$/.test(s)) return { ok: false, error: "Username not allowed." };

    return { ok: true, value: s };
}
