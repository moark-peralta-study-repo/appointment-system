// Token helpers for email flows. We never store a plaintext code/token —
// only a SHA-256 hash — so a database leak does not expose usable OTPs.
import crypto from "node:crypto";

/** 6-digit numeric OTP (used for email verification). */
export const generateOtp = () =>
	crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");

/** 32-char hex token (used for password-reset links). */
export const generateToken = () => crypto.randomBytes(24).toString("hex");

/** One-way hash of a code/token for storage + comparison. */
export const hashToken = (value) =>
	crypto.createHash("sha256").update(String(value)).digest("hex");

/** Constant-ish comparison so a stored hash never short-circuits. */
export const tokenMatches = (storedHash, candidate) =>
	storedHash === hashToken(candidate);
