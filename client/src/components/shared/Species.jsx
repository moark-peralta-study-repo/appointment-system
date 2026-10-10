import { PiBird, PiCat, PiDog, PiPawPrint } from "react-icons/pi";

// Species options + shared pet icon. Used by the admin patient form, the
// client pet form, and the client portal's pet/record lists — one source
// of truth so "rabbit" etc. never drifts between the two portals.
export const SPECIES_OPTIONS = ["dog", "cat", "bird", "rabbit", "other"];
export const GENDERS = ["male", "female"];

// Species icon with a paw fallback (bird/cat/dog recognized, else paw).
export function SpeciesIcon({ species, size = 22 }) {
	if (species === "cat") return <PiCat size={size} />;
	if (species === "bird") return <PiBird size={size} />;
	if (species === "dog") return <PiDog size={size} />;
	return <PiPawPrint size={size} />;
}

// Icon buttons for the client pet-species picker.
export const SPECIES_PICKER = [
	{ id: "dog", label: "Dog", icon: <PiDog size={20} /> },
	{ id: "cat", label: "Cat", icon: <PiCat size={20} /> },
	{ id: "bird", label: "Bird", icon: <PiBird size={20} /> },
	{ id: "other", label: "Other", icon: <PiPawPrint size={20} /> },
];
