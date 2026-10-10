import { useMemo, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import {
	useVets,
	useAppointments,
	useUsers,
} from "../../hooks/useAdminData";
import { isToday, initials } from "../../utils/admin";
import { scheduleLabel } from "../../utils/schedule";
import { FaStethoscope } from "react-icons/fa";
import { RxCalendar } from "react-icons/rx";
import { PiStar } from "react-icons/pi";
import { FiCheck, FiSearch } from "react-icons/fi";
import ScheduleEditor from "../../components/admin/ScheduleEditor";
import AdminVetForm from "../../components/admin/vets/AdminVetForm";
import AdminVetView from "../../components/admin/vets/AdminVetView";

/* ---------------- ADD VET FORM ---------------- */

/* ---------------- VET PROFILE VIEW ---------------- */

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

			{showAdd && <AdminVetForm onClose={() => setShowAdd(false)} />}

			{viewing && (
				<AdminVetView vet={viewing} onClose={() => setViewing(null)} />
			)}
		</>
	);
}

export default Veterinarians;
