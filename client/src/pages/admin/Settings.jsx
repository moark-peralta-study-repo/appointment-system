import { useEffect, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ScheduleEditor, { defaultSchedule } from "../../components/admin/ScheduleEditor";
import { useAuth } from "../../context/useAuth";
import { useVets, useUpdateVet } from "../../hooks/useAdminData";

const CLINIC_KEY = "mp_clinic_profile";
const TOGGLES_KEY = "mp_clinic_toggles";

const DEFAULT_TOGGLES = {
	allowOnlineBookings: true,
	requireConfirmation: true,
	sendReminders: true,
	allowSameDay: false,
	notifyNewBookings: true,
	notifyCancellations: true,
	lowAvailabilityAlerts: false,
};

function loadJSON(key, fallback) {
	try {
		const raw = localStorage.getItem(key);
		return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
	} catch {
		return fallback;
	}
}

/** A small "Saved ✓" flash shown after a successful mutation. */
function useSavedFlash() {
	const [saved, setSaved] = useState(false);
	const flash = () => {
		setSaved(true);
		clearTimeout(flash.t);
		flash.t = setTimeout(() => setSaved(false), 1800);
	};
	return [saved, flash];
}

function Settings() {
	const { user } = useAuth();
	const { data: vets = [] } = useVets();
	const updateVet = useUpdateVet();

	// This account's own vet profile — matched by name (the public vet
	// list omits email; the staff user list has the name).
	const myVet = vets.find((v) => v.name === user?.name);

	// --- Clinic profile (persisted locally — no clinic model in the API) ---
	const [clinic, setClinic] = useState(() =>
		loadJSON(CLINIC_KEY, {
			name: "Mutuals Paws Veterinary Clinic",
			email: "hello@mutualspaws.com",
			phone: "+63 917 123 4567",
			address: "123 Pet Care Avenue, Metro Manila",
			about:
				"Mutuals Paws Veterinary Clinic provides compassionate and reliable veterinary care for pets and their families.",
		}),
	);
	const [clinicDraft, setClinicDraft] = useState(clinic);
	const [clinicSaved, clinicFlash] = useSavedFlash();
	const setClinicField = (k) => (e) => setClinicDraft((c) => ({ ...c, [k]: e.target.value }));

	const saveClinic = () => {
		localStorage.setItem(CLINIC_KEY, JSON.stringify(clinicDraft));
		setClinic(clinicDraft);
		clinicFlash();
	};

	// --- Working hours (saved to the vet profile via PUT /vets/:id) ---
	const [schedule, setSchedule] = useState(() => {
		const fromApi = myVet?.schedule?.length ? myVet.schedule : null;
		return fromApi
			? [...fromApi].sort((a, b) => a.day - b.day)
			: Array.from({ length: 7 }, (_, i) => ({
					day: i,
					start: "09:00",
					end: "17:00",
					slotMinutes: 30,
				}));
	});
	const [hoursSaved, hoursFlash] = useSavedFlash();
	const [hoursError, setHoursError] = useState("");

	// Keep the editor in sync if the API profile loads in.
	useEffect(() => {
		if (myVet?.schedule?.length) {
			setSchedule([...myVet.schedule].sort((a, b) => a.day - b.day));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [myVet?._id]);

	const saveHours = () => {
		if (!myVet) {
			setHoursError("No vet profile found for this account — hours can't be saved.");
			return;
		}
		setHoursError("");
		// Only send open days; the API replaces the whole schedule.
		const openDays = schedule
			.filter((s) => s.open !== false)
			.map(({ day, start, end, slotMinutes }) => ({
				day,
				start,
				end,
				slotMinutes: slotMinutes || 30,
			}));
		updateVet.mutate(
			{ id: myVet._id, body: { schedule: openDays } },
			{
				onSuccess: hoursFlash,
				onError: (e) => setHoursError(e.message),
			},
		);
	};

	// --- Toggles (persisted locally) ---
	const [toggles, setToggles] = useState(() =>
		loadJSON(TOGGLES_KEY, DEFAULT_TOGGLES),
	);
	const setToggle = (k) => (e) => {
		const next = { ...toggles, [k]: e.target.checked };
		setToggles(next);
		localStorage.setItem(TOGGLES_KEY, JSON.stringify(next));
	};

	const roleLabel = user?.role === "vet" ? "Veterinarian" : "Clinic Administrator";
	const initials = user?.name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "A";

	return (
		<>
			<AdminPageHeader
				eyebrow="SYSTEM CONFIGURATION"
				title="Settings"
				description="Manage clinic information, working hours, and system preferences."
			/>

			<div className="settings-layout">
				{/* Main Settings */}
				<div className="settings-content">
					{/* Clinic Profile */}
					<section className="admin-panel settings-panel">
						<div className="settings-panel-header">
							<div>
								<h2>Clinic Profile</h2>
								<p>
									Display information for the clinic. (Stored locally — a
									shared clinic model isn't in the API yet.)
								</p>
							</div>
						</div>

						<div className="settings-form-grid">
							<div className="settings-field settings-full">
								<label>Clinic Name</label>
								<input type="text" value={clinicDraft.name} onChange={setClinicField("name")} />
							</div>

							<div className="settings-field">
								<label>Email Address</label>
								<input type="email" value={clinicDraft.email} onChange={setClinicField("email")} />
							</div>

							<div className="settings-field">
								<label>Phone Number</label>
								<input type="text" value={clinicDraft.phone} onChange={setClinicField("phone")} />
							</div>

							<div className="settings-field settings-full">
								<label>Clinic Address</label>
								<input type="text" value={clinicDraft.address} onChange={setClinicField("address")} />
							</div>

							<div className="settings-field settings-full">
								<label>About the Clinic</label>
								<textarea rows="4" value={clinicDraft.about} onChange={setClinicField("about")} />
							</div>
						</div>

						<div className="settings-actions">
							<button
								className="admin-secondary-button"
								type="button"
								onClick={() => setClinicDraft(clinic)}
							>
								Reset
							</button>
							<button
								className="admin-primary-button"
								type="button"
								onClick={saveClinic}
							>
								{clinicSaved ? "Saved ✓" : "Save Changes"}
							</button>
						</div>
					</section>

					{/* Working Hours */}
					<section className="admin-panel settings-panel">
						<div className="settings-panel-header">
							<div>
								<h2>Working Hours</h2>
								<p>
									Your personal schedule — saved to your vet profile and used to
									compute bookable slots.
								</p>
							</div>
						</div>

						{myVet && (
							<ScheduleEditor value={schedule} onChange={setSchedule} />
						)}

						{hoursError && <div className="admin-form-error">⚠ {hoursError}</div>}

						<div className="settings-actions">
							<button className="admin-secondary-button" type="button" onClick={saveHours} disabled={updateVet.isPending}>
								{updateVet.isPending ? "Saving…" : hoursSaved ? "Saved ✓" : "Save Hours"}
							</button>
						</div>
					</section>

					{/* Appointment Settings */}
					<section className="admin-panel settings-panel">
						<div className="settings-panel-header">
							<div>
								<h2>Appointment Settings</h2>
								<p>Control how appointments are handled by the clinic.</p>
							</div>
						</div>

						<div className="settings-options">
							<SettingToggle
								label="Allow online bookings"
								hint="Let pet owners request appointments through the client portal."
								checked={toggles.allowOnlineBookings}
								onChange={setToggle("allowOnlineBookings")}
							/>
							<SettingToggle
								label="Require appointment confirmation"
								hint="New appointment requests must be confirmed by clinic staff."
								checked={toggles.requireConfirmation}
								onChange={setToggle("requireConfirmation")}
							/>
							<SettingToggle
								label="Send appointment reminders"
								hint="Send reminders to pet owners before their scheduled appointment."
								checked={toggles.sendReminders}
								onChange={setToggle("sendReminders")}
							/>
							<SettingToggle
								label="Allow same-day appointments"
								hint="Allow clients to request appointments on the same day."
								checked={toggles.allowSameDay}
								onChange={setToggle("allowSameDay")}
							/>
						</div>
					</section>

					{/* Notifications */}
					<section className="admin-panel settings-panel">
						<div className="settings-panel-header">
							<div>
								<h2>Notifications</h2>
								<p>Choose which system notifications the administrator receives.</p>
							</div>
						</div>

						<div className="settings-options">
							<SettingToggle
								label="New appointment requests"
								hint="Receive a notification when a new booking is submitted."
								checked={toggles.notifyNewBookings}
								onChange={setToggle("notifyNewBookings")}
							/>
							<SettingToggle
								label="Appointment cancellations"
								hint="Get notified when an existing appointment is cancelled."
								checked={toggles.notifyCancellations}
								onChange={setToggle("notifyCancellations")}
							/>
							<SettingToggle
								label="Low availability alerts"
								hint="Receive alerts when veterinarian availability is limited."
								checked={toggles.lowAvailabilityAlerts}
								onChange={setToggle("lowAvailabilityAlerts")}
							/>
						</div>
					</section>
				</div>

				{/* Account Card */}
				<aside className="settings-sidebar-card">
					<div className="settings-profile-avatar">{initials}</div>

					<h3>{user?.name ?? "Admin"}</h3>

					<p>{roleLabel}</p>

					<div className="settings-profile-divider"></div>

					<div className="settings-account-info">
						<div>
							<span>Email</span>
							<strong>{user?.email ?? "—"}</strong>
						</div>

						<div>
							<span>Role</span>
							<strong>{roleLabel}</strong>
						</div>
					</div>

					<button className="settings-account-button" type="button" title="Coming soon">
						Edit Account
					</button>
				</aside>
			</div>
		</>
	);
}

/* ---------------- small pieces ---------------- */

function SettingToggle({ label, hint, checked, onChange }) {
	return (
		<div className="settings-option">
			<div>
				<strong>{label}</strong>
				<span>{hint}</span>
			</div>

			<label className="settings-toggle">
				<input type="checkbox" checked={checked} onChange={onChange} />
				<span></span>
			</label>
		</div>
	);
}

export default Settings;
