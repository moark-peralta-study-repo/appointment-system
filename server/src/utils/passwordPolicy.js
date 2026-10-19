// Shared password policy — one definition so client-side hints, the
// express-validator chains and any service-level checks can't drift.
//
// Modern handling (NIST 800-63B style): length is the main factor; block
// short, over-long, and the most common/leaked passwords. No forced
// character classes beyond one symbol.
export const MIN_PASSWORD = 8;
export const MAX_PASSWORD = 72; // bcrypt's input limit

// Tiny common-password blacklist (top of the leaked-password lists).
// Substrings so "password123" or "qwerty123" are caught too.
const COMMON_PASSWORDS = [
	"password", "passw0rd", "p@ssword", "qwerty", "abc123", "123456",
	"12345678", "iloveyou", "admin", "welcome", "monkey", "dragon",
	"letmein", "sunshine", "princess", "football", "baseball",
	"pinky paws", "pinkpaws",
];

/**
 * Policy check for a NEW password. Returns null when acceptable, otherwise
 * a short reason ("short" | "long" | "common" | "no-symbol" | ...).
 * `context` — optional email/name strings; the password must not contain
 * them.
 */
export function passwordProblem(value, { email, name } = {}) {
	if (!value) return "empty";
	const pw = String(value);

	if (pw.length < MIN_PASSWORD) return "short";
	if (pw.length > MAX_PASSWORD) return "long";

	const lower = pw.toLowerCase();
	const personal = [email, name]
		.filter(Boolean)
		.map((s) => String(s).trim().toLowerCase())
		.flatMap((s) => [s, s.split(" ")[0]])
		.filter((s) => s.length >= 3);
	if (personal.some((p) => lower.includes(p))) return "personal";

	if (COMMON_PASSWORDS.some((c) => lower.includes(c))) return "common";

	if (!/[^a-zA-Z0-9]/.test(pw)) return "no-symbol";

	return null;
}

/** Human-readable message for a passwordProblem() result. */
export function passwordMessage(problem) {
	switch (problem) {
		case null:
			return "";
		case "empty":
			return `Password is required (at least ${MIN_PASSWORD} characters).`;
		case "short":
			return `Password must be at least ${MIN_PASSWORD} characters.`;
		case "long":
			return `Password must be at most ${MAX_PASSWORD} characters.`;
		case "personal":
			return "Password must not contain your name or email.";
		case "common":
			return "This password is too common — choose something less predictable.";
		case "no-symbol":
			return "Password must include at least one symbol (e.g. ! @ # $ %).";
		default:
			return "Password does not meet the requirements.";
	}
}

/** Convenience: "" when acceptable, otherwise the human-readable message. */
export function checkPassword(value, context = {}) {
	return passwordMessage(passwordProblem(value, context));
}
