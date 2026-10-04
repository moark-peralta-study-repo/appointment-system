// Date + formatting helpers for the admin dashboard.
// Appointment `date` comes back from the API as an ISO string (Mongo Date);
// `time` is a 24h "HH:MM" string.

function midnight(value) {
	const d = new Date(value);
	return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** True if `value` is today (server-local calendar day). */
export function isToday(value) {
	return midnight(value) === midnight(new Date());
}

/** True if `value` is within the next `n` days (including today). */
export function isWithinDays(value, n) {
	const diff = midnight(value) - midnight(new Date());
	return diff >= 0 && diff <= n * 86400000;
}

/** "09:30" (24h) -> "09:30 AM". */
export function format12h(hhmm) {
	if (!hhmm) return "";
	const [h, m] = hhmm.split(":").map(Number);
	const period = h < 12 ? "AM" : "PM";
	const hr = h % 12 === 0 ? 12 : h % 12;
	return `${String(hr).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

/** ISO date string -> "Oct 3, 2026". */
export function formatDate(value) {
	if (!value) return "—";
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "—";
	return d.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

/** "Dr. Evelyn Dane" -> "ED". */
export function initials(name = "") {
	const parts = name.replace(/^Dr\.\s*/i, "").split(" ").filter(Boolean);
	const letters = parts
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	return letters.slice(0, 2) || "?";
}
