import { useMemo, useState } from "react";
import { PiCat, PiDog } from "react-icons/pi";
import { FiPlus, FiAlertTriangle } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminModal from "../../components/admin/AdminModal";
import {
	usePets,
	useUsers,
	useAppointments,
	useDeletePet,
} from "../../hooks/useAdminData";
import { formatDate } from "../../utils/admin";
import { PiPawPrint } from "react-icons/pi";
import { FiSearch } from "react-icons/fi";
import AdminPatientForm from "../../components/admin/patients/AdminPatientForm";
import AdminPatientView from "../../components/admin/patients/AdminPatientView";

function Patients() {
	const { data: pets = [], isPending } = usePets();
	const { data: users = [] } = useUsers();
	const { data: appointments = [] } = useAppointments();

	const deletePet = useDeletePet();

	const [speciesFilter, setSpeciesFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [search, setSearch] = useState("");
	const [showAdd, setShowAdd] = useState(false);
	const [viewing, setViewing] = useState(null);
	const [editing, setEditing] = useState(null);
	const [deleting, setDeleting] = useState(null);

	const ownersById = Object.fromEntries(users.map((u) => [u._id, u]));

	// Last visit date per pet + all visits (for the view panel).
	const visitsByPet = {};
	for (const a of appointments) {
		if (!a.pet?._id) continue;
		(visitsByPet[a.pet._id] ||= []).push(a);
	}

	const rows = useMemo(() => {
		const q = search.trim().toLowerCase();
		return pets
			.map((p) => {
				const owner = ownersById[p.owner];
				const lastDate = (visitsByPet[p._id] ?? []).reduce(
					(m, a) => Math.max(m, new Date(a.date).getTime()),
					0,
				);
				return {
					...p,
					owner,
					ownerName: owner?.name ?? "—",
					lastVisit: lastDate ? formatDate(lastDate) : "No visits yet",
					status: p.notes ? "Under Observation" : "Healthy",
					species: p.species,
				};
			})
			.filter((p) => speciesFilter === "all" || p.species === speciesFilter)
			.filter(
				(p) =>
					statusFilter === "all" ||
					(statusFilter === "observation") ===
						(p.status === "Under Observation"),
			)
			.filter((p) => {
				if (!q) return true;
				return `${p.name} ${p.breed ?? ""} ${p.ownerName}`
					.toLowerCase()
					.includes(q);
			});
	}, [pets, ownersById, visitsByPet, speciesFilter, statusFilter, search]);

	const dogs = pets.filter((p) => p.species === "dog").length;
	const cats = pets.filter((p) => p.species === "cat").length;

	const confirmDelete = () => {
		deletePet.mutate(deleting._id, {
			onSuccess: () => {
				setDeleting(null);
				if (viewing?._id === deleting._id) setViewing(null);
			},
		});
	};

	return (
		<>
			<AdminPageHeader
				eyebrow="CLINIC MANAGEMENT"
				title="Patients"
				description="View and manage all pets registered at Mutuals Paws."
				actions={
					<button
						className="admin-primary-button"
						type="button"
						onClick={() => setShowAdd(true)}
					>
						+ Add Patient
					</button>
				}
			/>

			{/* PATIENT SUMMARY */}

			<section className="patient-summary">
				<div className="patient-summary-card">
					<div className="patient-summary-icon blue">
						<PiPawPrint size={20} />
					</div>

					<div>
						<span>Total Patients</span>
						<strong>
							{isPending ? <span className="mini-spinner" /> : pets.length}
						</strong>
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
						<strong>
							{rows.filter((r) => r.status === "Under Observation").length}
						</strong>
					</div>
				</div>
			</section>

			{/* PATIENT TABLE */}

			<section className="admin-panel patients-page-panel">
				<div className="patients-toolbar">
					<div className="patient-search">
						<FiSearch size={15} />

						<input
							type="text"
							placeholder="Search patient or owner..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>

					<div className="patient-filters">
						<select
							value={speciesFilter}
							onChange={(e) => setSpeciesFilter(e.target.value)}
						>
							<option value="all">All Species</option>
							<option value="dog">Dogs</option>
							<option value="cat">Cats</option>
						</select>

						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
						>
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
										<div className="table-actions">
											<button
												className="patient-view-button"
												type="button"
												onClick={() => setViewing(patient)}
											>
												View
											</button>
											<button
												className="row-action confirm"
												type="button"
												onClick={() => setEditing(patient)}
											>
												Edit
											</button>
											<button
												className="row-action cancel"
												type="button"
												onClick={() => setDeleting(patient)}
											>
												Delete
											</button>
										</div>
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
					<span>
						Showing {rows.length} of {pets.length} patients
					</span>

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

			{showAdd && <AdminPatientForm onClose={() => setShowAdd(false)} />}
			{editing && (
				<AdminPatientForm pet={editing} onClose={() => setEditing(null)} />
			)}

			{viewing && (
				<AdminPatientView
					pet={viewing}
					ownersById={ownersById}
					visits={(visitsByPet[viewing._id] ?? []).sort(
						(x, y) => new Date(y.date) - new Date(x.date),
					)}
					onClose={() => setViewing(null)}
				/>
			)}

			{deleting && (
				<AdminModal
					eyebrow="CONFIRM"
					title={`Delete ${deleting.name}?`}
					onClose={() => setDeleting(null)}
					footer={
						<>
							<button
								className="admin-secondary-button"
								type="button"
								onClick={() => setDeleting(null)}
							>
								Cancel
							</button>
							<button
								className="row-action cancel"
								type="button"
								disabled={deletePet.isPending}
								onClick={confirmDelete}
							>
								{deletePet.isPending ? "Deleting…" : "Delete Patient"}
							</button>
						</>
					}
				>
					<p className="admin-slot-note">
						This removes {deleting.name} from the patient register. Visit
						history stays on the appointments page.
					</p>
					{deletePet.error && (
						<div className="admin-form-error">
							<FiAlertTriangle size={13} /> {deletePet.error.message}
						</div>
					)}
				</AdminModal>
			)}
		</>
	);
}

export default Patients;
