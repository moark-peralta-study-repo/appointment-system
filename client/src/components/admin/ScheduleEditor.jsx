// Controlled per-day working schedule editor.
//
// value: [{ day, start, end, slotMinutes, open? }] — parent owns the state.
// Rows render Monday-first. Unchecking a day flags it `open: false`; the
// parent decides whether to drop closed days before sending to the API.

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Mon..Sun

export function defaultSchedule() {
	return WEEK_ORDER.map((day) => ({
		day,
		start: "09:00",
		end: "17:00",
		slotMinutes: 30,
		open: true,
	}));
}

function ScheduleEditor({ value, onChange }) {
	// Always offer all 7 days (Mon-first) so a missing day can be enabled;
	// provided days keep their values, absent ones default closed.
	const provided = new Map((value ?? []).map((s) => [s.day, s]));
	const rows = WEEK_ORDER.map(
		(day) =>
			provided.get(day) ?? {
				day,
				start: "09:00",
				end: "17:00",
				slotMinutes: 30,
				open: false,
			},
	);

	const setRow = (i, patch) =>
		onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
	const toggleRow = (i, open) =>
		onChange(rows.map((r, idx) => (idx === i ? { ...r, open } : r)));

	return (
		<div className="schedule-editor">
			{rows.map((row, i) => {
				const open = row.open !== false;
				return (
					<div className={`schedule-row${open ? "" : " disabled"}`} key={row.day}>
						<strong>{DAY_NAMES[row.day]}</strong>

						<input
							type="time"
							value={row.start}
							disabled={!open}
							onChange={(e) => setRow(i, { start: e.target.value })}
						/>
						<span className="schedule-to">to</span>
						<input
							type="time"
							value={row.end}
							disabled={!open}
							onChange={(e) => setRow(i, { end: e.target.value })}
						/>

						<input
							type="number"
							min="5"
							step="5"
							value={row.slotMinutes}
							disabled={!open}
							onChange={(e) => setRow(i, { slotMinutes: Number(e.target.value) })}
						/>

						<input
							type="checkbox"
							checked={open}
							onChange={(e) => toggleRow(i, e.target.checked)}
							title={open ? "Open — uncheck to close this day" : "Closed — check to open"}
						/>
					</div>
				);
			})}
		</div>
	);
}

export default ScheduleEditor;
