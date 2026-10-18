// Client-side field validation helpers.
//
// Every checker returns "" when the value is valid and a human-readable
// message when it isn't. Forms feed these into `collectErrors`, which
// produces an `errors` object keyed by field name — the same shape that
// gets rendered as one `.field-error` line under each invalid input
// (see styles/form-errors.css). Presence and format checks are separate
// so a field can compose them with `firstError`.
export const isEmail = (value) =>
	/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

export function required(value, label) {
	return value && String(value).trim() !== "" ? "" : `${label} is required.`;
}

// Assumes presence was already checked — only flags bad formatting.
export function emailValue(value) {
	if (!value || !String(value).trim()) return "";
	return isEmail(value) ? "" : "Enter a valid email address.";
}

export function minLength(value, min, label) {
	if (!value) return "";
	return value.length >= min ? "" : `${label} must be at least ${min} characters.`;
}

// confirm must be non-empty (presence) AND equal to password.
export function passwordsMatch(password, confirm) {
	if (!confirm || !String(confirm).trim()) return "";
	return confirm === password ? "" : "Passwords do not match.";
}

// Philippine mobile number — 11 digits, no more, no less:
//   0917 123 4567   (local, leading 0)
//   +63 917 123 4567 / 639171234567  (international, 0 dropped)
// Optional field — only validated when something was typed.
export function phoneValue(value) {
	if (!value || !String(value).trim()) return "";
	let s = String(value).trim();
	if (s[0] === "+") s = s.slice(1); // the only symbol allowed, only up front
	const digits = s.replace(/[\s\-().]/g, "");
	return /^(09|639)\d{9}$/.test(digits)
		? ""
		: "Enter an 11-digit PH mobile number (e.g. 0917 123 4567).";
}

export function otpValue(value) {
	if (!value) return "";
	return /^\d{6}$/.test(String(value).trim()) ? "" : "Enter the 6-digit code.";
}

export function ageValue(value, max = 50) {
	if (value === "" || value == null) return ""; // optional
	const n = Number(value);
	return Number.isFinite(n) && n >= 0 && n <= max ? "" : `Enter an age between 0 and ${max}.`;
}

// First non-empty message wins; all "" → "".
export function firstError(...checks) {
	for (const c of checks) if (c) return c;
	return "";
}

// rules: { fieldName: message } → { fieldName: message } with valid ones dropped.
export function collectErrors(rules) {
	const errors = {};
	for (const [key, msg] of Object.entries(rules)) if (msg) errors[key] = msg;
	return errors;
}

// React hook (imported as { useFieldErrors } where needed) — pairs with
// collectErrors: returns [errors, validate, clearField].
//
//   const [errors, validate, clear] = useFieldErrors();
//   validate(rules)          → sets state, returns the found errors
//   onChange={clear("name")} → drops that field's error as the user edits
import { useState } from "react";

export function useFieldErrors() {
	const [errors, setErrors] = useState({});
	const validate = (rules) => {
		const found = collectErrors(rules);
		setErrors(found);
		return found;
	};
	const clear = (key) => () =>
		setErrors((prev) => {
			if (!prev[key]) return prev;
			const next = { ...prev };
			delete next[key];
			return next;
		});
	return [errors, validate, clear];
}
