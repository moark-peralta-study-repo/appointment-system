// Recharts renders raw SVG, so it can't read CSS vars — these are the light
// theme values (the app's running mode), matched to the palette tokens.
export const C = {
	primary: "#e21990",
	success: "#2f7d4f",
	warning: "#c88a2a",
	danger: "#c02740",
	grid: "#f0dcee",
	axis: "#8a7ba0",
	surface: "#ffffff",
};

// Shared axis tick style (fontSize/fill) for every chart on the page.
export const AXIS_TICK = { fontSize: 11, fill: C.axis };
