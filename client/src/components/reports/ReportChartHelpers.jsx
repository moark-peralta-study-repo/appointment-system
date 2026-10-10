// Recharts tooltip + donut center label for the admin Reports page.
import { C, AXIS_TICK } from "./chartTheme";

// Styled tooltip + donut center label used by every chart on the Reports
// page.

function ChartTip({ active, payload, label, formatter }) {
	if (!active || !payload?.length) return null;
	return (
		<div style={{
			background: C.surface,
			border: `1px solid ${C.grid}`,
			borderRadius: 10,
			padding: "8px 12px",
			fontSize: 12,
			boxShadow: "0 4px 14px rgba(4,30,48,.10)",
		}}>
			{label != null && (
				<div style={{ color: C.axis, marginBottom: 5, fontSize: 11 }}>{label}</div>
			)}
			{payload.map((p, i) => (
				<div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: i ? 3 : 0 }}>
					<span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: "inline-block" }} />
					<span style={{ color: C.axis }}>{formatter ? formatter(p, i) : p.name}</span>
					<strong>{p.value}</strong>
				</div>
			))}
		</div>
	);
}


function CenterLabel({ value, sub }) {
	return (
		<div style={{
			position: "absolute", inset: 0,
			display: "flex", flexDirection: "column",
			alignItems: "center", justifyContent: "center",
			pointerEvents: "none",
		}}>
			<span style={{ fontSize: 28, fontWeight: 800, color: "var(--text)" }}>{value}</span>
			<span style={{ fontSize: 11, color: "var(--text-soft)", marginTop: 2 }}>{sub}</span>
		</div>
	);
}



export { ChartTip, CenterLabel };

