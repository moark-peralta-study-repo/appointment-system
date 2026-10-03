export function getFreeSlots(scheduleEntries, bookedTimes, date) {
	const entry = scheduleEntries.find((e) => e.day === date.getDay());
	if (!entry) return [];

	const start = toMinutes(entry.start);
	const end = toMinutes(entry.end);
	const raw = [];

	for (let t = start; t + entry.slotMinutes <= end; t += entry.slotMinutes) {
		raw.push(toHHMM(t));
	}

	return raw.filter((s) => !bookedTimes.includes(s));
}

function toMinutes(hhmm) {
	const [h, m] = hhmm.split(":").map(Number);
	return h * 60 + m;
}

function toHHMM(mins) {
	const HH = String(Math.floor(mins / 60)).padStart(2, "0");
	const mm = String(mins % 60).padStart(2, "0");

	return `${HH}:${mm}`;
}
