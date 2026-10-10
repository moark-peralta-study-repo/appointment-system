// Recharts renders raw SVG, so it can't read CSS vars — these are the light
// theme values (the app's running mode), matched to the palette tokens.
export const C = {
	primary: "#0091fd",
	success: "#7cb342",
	warning: "#f4a63a",
	danger: "#e0635a",
	grid: "#e4e9dc",
	axis: "#7b8577",
	surface: "#ffffff",
};

// Shared axis tick style (fontSize/fill) for every chart on the page.
export const AXIS_TICK = { fontSize: 11, fill: C.axis };
