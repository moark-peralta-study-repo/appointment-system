// Single source of truth for the clinic's service menu.
//
// Used by the public Home (ServicesSection), the booking form, and the
// Reports "popular services" view so the three can't drift apart.
//
// Note: there is no `services` collection in the database yet — an
// appointment's `reason` is free text. These are the canonical choices we
// present in the UI; the booking flow writes the selected label into the
// appointment's `reason`.
export const SERVICES = [
	{
		id: "wellness",
		label: "Wellness Exam",
		short: "Routine health checks designed to catch concerns early.",
		price: "From ₱850",
		icon: "♡",
	},
	{
		id: "vaccination",
		label: "Vaccination",
		short: "Essential vaccinations to help protect your pet from illness.",
		price: "From ₱550",
		icon: "✚",
	},
	{
		id: "dental",
		label: "Dental Care",
		short: "Professional dental cleaning to support healthy teeth and gums.",
		price: "From ₱1,200",
		icon: "✦",
	},
	{
		id: "diagnostics",
		label: "Diagnostics",
		short: "Bloodwork and testing to help our veterinarians understand your pet.",
		price: "20+ Tests",
		icon: "⌕",
	},
	{
		id: "surgery",
		label: "Surgery",
		short: "Specialized procedures supported by careful monitoring and aftercare.",
		price: "Consultation",
		icon: "◆",
	},
	{
		id: "urgent",
		label: "Urgent Care",
		short: "Prompt veterinary attention for unexpected health concerns.",
		price: "Emergency care",
		icon: "!",
	},
];

// Species ids must match the Pet model's `species` enum exactly.
export const PET_TYPES = [
	{ id: "dog", label: "Dog" },
	{ id: "cat", label: "Cat" },
	{ id: "bird", label: "Bird" },
	{ id: "rabbit", label: "Rabbit" },
	{ id: "other", label: "Other" },
];

export function serviceById(id) {
	return SERVICES.find((s) => s.id === id) ?? null;
}
