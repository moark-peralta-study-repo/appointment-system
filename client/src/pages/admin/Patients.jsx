import { useState } from "react";
import { PiCat, PiDog } from "react-icons/pi";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { FiPlus } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { usePets, useUsers, useAppointments } from "../../hooks/useAdminData";
import { formatDate } from "../../utils/admin";

function Patients() {
	const { data: pets = [], isPending } = usePets();
	const { data: users = [] } = useUsers();
	const { data: appointments = [] } = useAppointments();

	const [speciesFilter, setSpeciesFilter] = useState("all");

	const ownersById = Object.fromEntries(users.map((u) => [u._id, u]));

	// Last completed/appointment date per pet.
	const lastVisit = {};
	for (const a of appointments) {
		if (!a.pet?._id) continue;
		const d = new Date(a.date).getTime();
		if (!lastVisit[a.pet._id] || d > lastVisit[a.pet._id]) {
			lastVisit[a.pet._id] = d;
		}
	}

	const rows = pets
		.filter((p) => speciesFilter === "all" || p.species === speciesFilter)
		.map((p) => ({
			...p,
			ownerName: ownersById[p.owner]?.name ?? "—",
			lastVisit: lastVisit[p._id] ? formatDate(lastVisit[p._id]) : "No visits yet",
			status: p.notes ? "Under Observation" : "Healthy",
			emoji: p.species === "cat" ? "🐱" : "🐶",
		}));

	const dogs = pets.filter((p) => p.species === "dog").length;
	const cats = pets.filter((p) => p.species === "cat").length;

	return (
		<>
			<AdminPageHeader
				eyebrow="CLINIC MANAGEMENT"
				title="Patients"
				description="View and manage all pets registered at Mutuals Paws."
				actions={
					<button className="admin-primary-button" type="button">
						+ Add Patient
					</button>
				}
			/>

			{/* PATIENT SUMMARY */}

			<section className="patient-summary">
				<div className="patient-summary-card">
					<div className="patient-summary-icon blue">🐾</div>

					<div>
						<span>Total Patients</span>
						<strong>{isPending ? "…" : pets.length}</strong>
					</div>
				</div>

				<div className="patient-summary-card">
					<div className="patient-summary-icon yellow">
						<PiDog />
					</div>

					<div>
						<span>Dogs</span>
						<strong>{dogs}</strong>
					</div>
				</div>

				<div className="patient-summary-card">
					<div className="patient-summary-icon green">
						<PiCat />
					</div>

					<div>
						<span>Cats</span>
						<strong>{cats}</strong>
					</div>
				</div>

				<div className="patient-summary-card">
					<div className="patient-summary-icon soft-blue">
						<FiPlus />
					</div>

					<div>
						<span>Under Observation</span>
						<strong>{rows.filter((r) => r.status === "Under Observation").length}</strong>
					</div>
				</div>
			</section>

			{/* PATIENT TABLE */}

			<section className="admin-panel patients-page-panel">
				<div className="patients-toolbar">
					<div className="patient-search">
						<span>⌕</span>

						<input type="text" placeholder="Search patient or owner..." />
					</div>

					<div className="patient-filters">
						<select value={speciesFilter} onChange={(e) => setSpeciesFilter(e.target.value)}>
							<option value="all">All Species</option>
							<option value="dog">Dogs</option>
							<option value="cat">Cats</option>
						</select>

						<select defaultValue="all">
							<option value="all">All Status</option>
							<option value="healthy">Healthy</option>
							<option value="observation">Under Observation</option>
						</select>
					</div>
				</div>

				<div className="patients-table-wrapper">
					<table className="patients-table">
						<thead>
							<tr>
								<th>PATIENT</th>
								<th>OWNER</th>
								<th>AGE</th>
								<th>LAST VISIT</th>
								<th>STATUS</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{isPending && (
								<tr>
									<td colSpan={6} className="admin-panel-empty">
										Loading patients…
									</td>
								</tr>
							)}

							{rows.map((patient) => (
								<tr key={patient._id}>
									<td>
										<div className="patient-table-info">
											<div className="patient-table-avatar">
												{patient.emoji}
											</div>

											<div>
												<strong>{patient.name}</strong>

												<span>
													{patient.species ?? "—"} • {patient.breed ?? "—"}
												</span>
											</div>
										</div>
									</td>

									<td>
										<span className="patient-owner">{patient.ownerName}</span>
									</td>

									<td>{patient.age != null ? `${patient.age} years` : "—"}</td>

									<td>{patient.lastVisit}</td>

									<td>
										<span
											className={`patient-status ${
												patient.status === "Healthy" ? "healthy" : "observation"
											}`}
										>
											{patient.status}
										</span>
									</td>

									<td>
										<button className="patient-view-button" type="button">
											View
										</button>
									</td>
								</tr>
							))}

							{rows.length === 0 && !isPending && (
								<tr>
									<td colSpan={6} className="admin-panel-empty">
										No patients found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* TABLE FOOTER */}

				<div className="patients-table-footer">
					<span>Showing {rows.length} of {pets.length} patients</span>

					<div className="patient-pagination">
						<button type="button">‹</button>
						<button className="active" type="button">
							1
						</button>
						<button type="button">
							<IoIosArrowForward />
						</button>
					</div>
				</div>
			</section>
		</>
	);
}

export default Patients;
