import { useMemo, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminModal from "../../components/admin/AdminModal";
import ScheduleEditor, { defaultSchedule } from "../../components/admin/ScheduleEditor";
import {
	useVets,
	useAppointments,
	useUsers,
	useCreateVet,
	useDeactivateVet,
} from "../../hooks/useAdminData";
import { isToday, initials } from "../../utils/admin";
import { FaStethoscope } from "react-icons/fa";
import { RxCalendar } from "react-icons/rx";
import { PiStar } from "react-icons/pi";
import { FiAlertTriangle, FiCheck, FiSearch } from "react-icons/fi";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "Mon–Fri 09:00–17:00" from a vet's embedded schedule. */
function scheduleLabel(schedule = []) {
	if (!schedule.length) return "No schedule set";
	const days = [...new Set(schedule.map((s) => DAY_NAMES[s.day]))].join(", ");
	const first = schedule[0];
	return `${days} ${first.start}–${first.end}`;
}

/* ---------------- ADD VET FORM ---------------- */

function VetForm({ onClose }) {
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

/* ---------------- VET PROFILE VIEW ---------------- */

function VetView({ vet, onClose }) {
	const { data: users = [] } = useUsers();
	const deactivateVet = useDeactivateVet();
	const [confirming, setConfirming] = useState(false);

	// The public vet list omits email/phone — the vet's name matches their
	// staff user record, so look it up there.
	const user = users.find((u) => u.name === vet.name);
	const phone = user?.phone;

	return (
		<AdminModal
			eyebrow="STAFF PROFILE"
			title={vet.name}
			onClose={onClose}
			wide
			footer={
				<>
					{confirming ? (
						<>
							<span className="admin-slot-note">
								{deactivateVet.error?.message ?? "Remove " + vet.name + " from the roster?"}
							</span>
							<button className="admin-secondary-button" type="button" onClick={() => setConfirming(false)}>
								Keep
							</button>
							<button
								className="row-action cancel"
								type="button"
								disabled={deactivateVet.isPending}
								onClick={() =>
									deactivateVet.mutate(vet._id, { onSuccess: onClose })
								}
							>
								{deactivateVet.isPending ? "Removing…" : "Deactivate"}
							</button>
						</>
					) : (
						<>
							<button className="admin-secondary-button" type="button" onClick={onClose}>
								Close
							</button>
							<button className="row-action cancel" type="button" onClick={() => setConfirming(true)}>
								Deactivate
							</button>
						</>
					)}
				</>
			}
		>
			<div className="admin-detail-grid">
				<div className="admin-detail-item">
					<span>EMAIL</span>
					<strong>{user?.email ?? "—"}</strong>
				</div>
				<div className="admin-detail-item">
					<span>PHONE</span>
					<strong>{phone ?? "—"}</strong>
				</div>
				<div className="admin-detail-item">
					<span>SPECIALTY</span>
					<strong>{vet.specialty ?? "General"}</strong>
				</div>
				<div className="admin-detail-item">
					<span>WORKING HOURS</span>
					<strong>{scheduleLabel(vet.schedule)}</strong>
				</div>
				{vet.bio && (
					<div className="admin-detail-item full">
						<span>BIO</span>
						<strong>{vet.bio}</strong>
					</div>
				)}
			</div>
		</AdminModal>
	);
}

/* ---------------- PAGE ---------------- */

function Veterinarians() {
	const { data: vets = [], isPending } = useVets();
	const { data: appointments = [] } = useAppointments();

	const [specialtyFilter, setSpecialtyFilter] = useState("all");
	const [availabilityFilter, setAvailabilityFilter] = useState("all");
	const [search, setSearch] = useState("");
	const [showAdd, setShowAdd] = useState(false);
	const [viewing, setViewing] = useState(null);

	// Active (pending/confirmed) appointments per vet, today — the API
	// flattens vet to a name string, so count by name.
	const todayByVet = {};
	for (const a of appointments) {
		if (!a.vet || !isToday(a.date)) continue;
		if (a.status !== "pending" && a.status !== "confirmed") continue;
		todayByVet[a.vet] = (todayByVet[a.vet] || 0) + 1;
	}

	const rows = useMemo(() => {
		const q = search.trim().toLowerCase();
		return vets
			.map((v) => ({
				...v,
				todayCount: todayByVet[v.name] || 0,
				status: todayByVet[v.name] ? "In Consultation" : "Available",
				initials: initials(v.name),
			}))
			.filter((v) => specialtyFilter === "all" || v.specialty === specialtyFilter)
			.filter((v) => availabilityFilter === "all" || v.status === availabilityFilter)
			.filter((v) => {
				if (!q) return true;
				return `${v.name} ${v.specialty ?? ""}`.toLowerCase().includes(q);
			});
	}, [vets, todayByVet, specialtyFilter, availabilityFilter, search]);

	const specialties = [...new Set(vets.map((v) => v.specialty).filter(Boolean))];

	return (
		<>
			<AdminPageHeader
				eyebrow="CLINIC MANAGEMENT"
				title="Veterinarians"
				description="Manage the veterinary team and monitor their availability."
				actions={
					<button className="admin-primary-button" type="button" onClick={() => setShowAdd(true)}>
						+ Add Veterinarian
					</button>
				}
			/>

			{/* SUMMARY */}

			<section className="vet-summary">
				<div className="vet-summary-card">
					<div className="vet-summary-icon blue">
						<FaStethoscope size={20} />
					</div>

					<div>
						<span>Total Veterinarians</span>
						<strong>
							{isPending ? (
								<span className="mini-spinner" />
							) : (
								vets.length
							)}
						</strong>
					</div>
				</div>

				<div className="vet-summary-card">
					<div className="vet-summary-icon green">
						<FiCheck size={20} />
					</div>

					<div>
						<span>Available Now</span>
						<strong>{rows.filter((r) => r.status === "Available").length}</strong>
					</div>
				</div>

				<div className="vet-summary-card">
					<div className="vet-summary-icon yellow">
						<RxCalendar size={20} />
					</div>

					<div>
						<span>Appointments Today</span>
						<strong>{Object.values(todayByVet).reduce((a, b) => a + b, 0)}</strong>
					</div>
				</div>

				<div className="vet-summary-card">
					<div className="vet-summary-icon soft-blue">
						<PiStar size={20} />
					</div>

					<div>
						<span>Specialties</span>
						<strong>{specialties.length}</strong>
					</div>
				</div>
			</section>

			{/* TOOLBAR */}

			<section className="admin-panel veterinarians-panel">
				<div className="veterinarians-toolbar">
					<div className="vet-search">
						<FiSearch size={15} />

						<input
							type="text"
							placeholder="Search veterinarian or specialty..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>

					<div className="vet-filters">
						<select value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)}>
							<option value="all">All Specialties</option>
							{specialties.map((s) => (
								<option key={s} value={s}>
									{s}
								</option>
							))}
						</select>

						<select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
							<option value="all">All Availability</option>
							<option value="Available">Available</option>
							<option value="In Consultation">
								In Consultation
							</option>
						</select>
					</div>
				</div>

				{/* VETERINARIAN CARDS */}

				<div className="veterinarian-grid">
					{isPending && (
						<div className="admin-panel-empty" style={{ gridColumn: "1 / -1" }}>
							Loading veterinary team…
						</div>
					)}

					{rows.map((vet) => (
						<div className="veterinarian-card" key={vet._id}>
							<div className="vet-card-top">
								<div className="vet-avatar">
									{vet.initials}
								</div>

								<button
									className="vet-more-button"
									type="button"
									aria-label={`More options for ${vet.name}`}
									onClick={() => setViewing(vet)}
								>
									•••
								</button>
							</div>

							<div className="vet-card-info">
								<h3>{vet.name}</h3>

								<p className="vet-specialty">
									{vet.specialty ?? "General"}
								</p>

								<p className="vet-experience">
									{scheduleLabel(vet.schedule)}
								</p>
							</div>

							<div className="vet-card-divider"></div>

							<div className="vet-card-bottom">
								<div>
									<span>Today's Appointments</span>
									<strong>{vet.todayCount}</strong>
								</div>

								<span
									className={`vet-status ${
										vet.status === "Available"
											? "available"
											: vet.status === "In Consultation"
												? "consultation"
												: "break"
									}`}
								>
									<span className="vet-status-dot"></span>
									{vet.status}
								</span>
							</div>

							<button
								className="vet-view-button"
								type="button"
								onClick={() => setViewing(vet)}
							>
								View Profile
							</button>
						</div>
					))}
				</div>
			</section>

			{showAdd && <VetForm onClose={() => setShowAdd(false)} />}

			{viewing && (
				<VetView vet={viewing} onClose={() => setViewing(null)} />
			)}
		</>
	);
}

export default Veterinarians;
