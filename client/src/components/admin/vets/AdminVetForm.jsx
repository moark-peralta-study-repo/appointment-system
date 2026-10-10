import { useState } from "react";
import AdminModal from "../AdminModal";
import ScheduleEditor, { defaultSchedule } from "../ScheduleEditor";
import { useCreateVet } from "../../../hooks/useAdminData";
import { FiAlertTriangle } from "react-icons/fi";


function AdminVetForm({ onClose }) {
	const createVet = useCreateVet();

	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		specialty: "",
		bio: "",
		schedule: defaultSchedule(),
	});
	const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

	const canSubmit =
		form.name.trim() && form.email.trim() && form.password.length >= 6;

	const submit = () => {
		// Only send days marked open.
		const schedule = form.schedule
			.filter((s) => s.open !== false)
			.map(({ day, start, end, slotMinutes }) => ({
				day,
				start,
				end,
				slotMinutes: slotMinutes || 30,
			}));

		createVet.mutate(
			{
				name: form.name.trim(),
				email: form.email.trim(),
				password: form.password,
				specialty: form.specialty.trim() || undefined,
				bio: form.bio.trim() || undefined,
				schedule,
			},
			{ onSuccess: onClose },
		);
	};

	return (
		<AdminModal
			eyebrow="CLINIC MANAGEMENT"
			title="Add Veterinarian"
			onClose={onClose}
			wide
			footer={
				<>
					<button className="admin-secondary-button" type="button" onClick={onClose}>
						Cancel
					</button>
					<button
						className="admin-primary-button"
						type="button"
						disabled={!canSubmit || createVet.isPending}
						onClick={submit}
					>
						{createVet.isPending ? "Creating…" : "Create Veterinarian"}
					</button>
				</>
			}
		>
			{createVet.error && (
				<div className="admin-form-error"><FiAlertTriangle size={13} /> {createVet.error.message}</div>
			)}

			<div className="admin-form-grid">
				<div className="admin-form-field">
					<label>Full Name <span>*</span></label>
					<input type="text" value={form.name} onChange={set("name")} placeholder="Dr. Jane Smith" />
				</div>

				<div className="admin-form-field">
					<label>Email <span>*</span></label>
					<input type="email" value={form.email} onChange={set("email")} placeholder="vet@mutualspaws.com" />
				</div>

				<div className="admin-form-field">
					<label>Portal Password <span>*</span></label>
					<input type="text" value={form.password} onChange={set("password")} />
				</div>

				<div className="admin-form-field">
					<label>Specialty</label>
					<input type="text" value={form.specialty} onChange={set("specialty")} placeholder="General Practice" />
				</div>

				<div className="admin-form-field full">
					<label>Bio</label>
					<textarea rows="2" value={form.bio} onChange={set("bio")} placeholder="Short public bio…" />
				</div>

				<div className="admin-form-field full">
					<label>Working Schedule</label>
					<p className="schedule-caption">
						Bookable slots come from each open day's times + slot length.
						Uncheck a day to close it.
					</p>
					<ScheduleEditor value={form.schedule} onChange={(schedule) => setForm((f) => ({ ...f, schedule }))} />
				</div>
			</div>
		</AdminModal>
	);
}


export default AdminVetForm;
