import { useState } from "react";
import { Link } from "react-router-dom";
import ClientHeader from "../../components/client/ClientHeader";
import DogLoader from "../../components/admin/DogLoader";
import { useAuth } from "../../context/useAuth";
import SettingToggle from "../../components/shared/SettingToggle";

const KEY = "mp_owner_toggles";
const DEFAULTS = {
	appointmentConfirmed: true,
	appointmentReminder: true,
	newVisitNotes: true,
	marketing: false,
};

function loadJSON() {
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
	} catch {
		return DEFAULTS;
	}
}

function ClientSettings() {
	const { isSettled } = useAuth();
	const [toggles, setToggles] = useState(loadJSON);

	const set = (k) => (e) => {
		const next = { ...toggles, [k]: e.target.checked };
		setToggles(next);
		localStorage.setItem(KEY, JSON.stringify(next));
	};

	if (!isSettled) {
		return (
			<div className="admin-loading" style={{ minHeight: "50vh" }}>
				<DogLoader />
			</div>
		);
	}

	return (
		<>
			<ClientHeader
				title="Settings"
				subtitle="Choose how the clinic keeps you in the loop."
			/>

			<section className="admin-panel client-settings-panel">
				<div className="settings-panel-header">
					<div>
						<h2>Notifications</h2>
						<p>
							Stored on this device — the email/SMS delivery pipeline comes
							after the clinic wires up a mail provider.
						</p>
					</div>
				</div>

				<div className="settings-options">
					<SettingToggle
						label="Appointment confirmed"
						hint="Let me know as soon as the clinic confirms my booking."
						checked={toggles.appointmentConfirmed}
						onChange={set("appointmentConfirmed")}
					/>
					<SettingToggle
						label="Visit reminders"
						hint="A reminder the day before any scheduled visit."
						checked={toggles.appointmentReminder}
						onChange={set("appointmentReminder")}
					/>
					<SettingToggle
						label="New visit notes"
						hint="Tell me when my vet files notes for a completed visit."
						checked={toggles.newVisitNotes}
						onChange={set("newVisitNotes")}
					/>
					<SettingToggle
						label="Tips & reminders"
						hint="Occasional care tips and vaccine reminders from the clinic."
						checked={toggles.marketing}
						onChange={set("marketing")}
					/>
				</div>
			</section>

			<section className="admin-panel client-settings-panel">
				<div className="settings-panel-header">
					<div>
						<h2>Account</h2>
						<p>Name, contact details and your registered pets live on the profile page.</p>
					</div>
					<Link className="admin-secondary-button" to="/client/profile">
						Open Profile
					</Link>
				</div>
			</section>
		</>
	);
}

export default ClientSettings;
