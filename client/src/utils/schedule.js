// Schedule formatting shared by the Veterinarians page and vet profile
// view.

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "Mon–Fri 09:00–17:00" from a vet's embedded schedule. */
export function scheduleLabel(schedule = []) {
	if (!schedule.length) return "No schedule set";
	const days = [...new Set(schedule.map((s) => DAY_NAMES[s.day]))].join(", ");
	const first = schedule[0];
	return `${days} ${first.start}–${first.end}`;
}
