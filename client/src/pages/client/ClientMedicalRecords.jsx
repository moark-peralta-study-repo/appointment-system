import { useMemo, useState } from "react";
import ClientHeader from "../../components/client/ClientHeader";
import DogLoader from "../../components/admin/DogLoader";
import { useMyAppointments, useMyPets } from "../../hooks/useClientData";
import { formatDate } from "../../utils/admin";
import { FaClipboardList } from "react-icons/fa";
import { PiPawPrint } from "react-icons/pi";
import { FiCheck } from "react-icons/fi";
import { SpeciesIcon } from "../../components/shared/Species";
import ClientRecordView from "../../components/client/records/ClientRecordView";

/* ---------------- RECORD VIEW ---------------- */

/* ---------------- PAGE ---------------- */
function ClientMedicalRecords() {
	const { data: appointments = [], isPending } = useMyAppointments();
	const { data: pets = [] } = useMyPets();
	const [search, setSearch] = useState("");
	const [viewing, setViewing] = useState(null);

	const records = useMemo(() => {
		const q = search.trim().toLowerCase();
		return appointments
			.filter((a) => a.status === "completed")
			.filter((a) => {
				if (!q) return true;
				return `${a.pet?.name ?? ""} ${a.reason ?? ""} ${a.vet ?? ""} ${a.vetNotes ?? ""}`
					.toLowerCase()
					.includes(q);
			})
			.sort((x, y) => new Date(y.date) - new Date(x.date));
	}, [appointments, search]);

	const withNotes = appointments.filter(
		(a) => a.status === "completed" && a.vetNotes,
	).length;

	return (
		<>
			<ClientHeader
				title="Medical Records"
				subtitle="Completed visits and the notes your vet left behind."
			/>

			{isPending ? (
				<div className="admin-loading" style={{ minHeight: "50vh" }}>
					<DogLoader />
					<p>Loading your records…</p>
				</div>
			) : (
				<>
					<section className="client-records-summary">
						<div className="medical-summary-card">
							<div className="medical-summary-icon blue">
								<FaClipboardList size={20} />
							</div>
							<div>
								<span>Completed Visits</span>
								<strong>
									{appointments.filter((a) => a.status === "completed").length}
								</strong>
							</div>
						</div>
						<div className="medical-summary-card">
							<div className="medical-summary-icon green">
								<FiCheck size={20} />
							</div>
							<div>
								<span>With Visit Notes</span>
								<strong>{withNotes}</strong>
							</div>
						</div>
						<div className="medical-summary-card">
							<div className="medical-summary-icon soft-blue">
								<PiPawPrint size={20} />
							</div>
							<div>
								<span>My Pets</span>
								<strong>{pets.length}</strong>
							</div>
						</div>
					</section>

					<section className="admin-panel client-records-panel">
						<div className="client-records-toolbar">
							<input
								type="search"
								className="client-appt-search"
								placeholder="Search pet, reason, vet or notes…"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>

						{records.length === 0 ? (
							<p className="admin-panel-empty">
								No completed visits yet. Records appear here once your vet marks
								a visit as complete.
							</p>
						) : (
							<div className="client-records-list">
								{records.map((a) => {
									const pet = a.pet;
									return (
										<article className="client-record-card" key={a._id}>
											<div className="client-appt-avatar">
												<SpeciesIcon species={pet?.species} />
											</div>

											<div className="client-record-main">
												<strong>
													{pet?.name ?? "Unknown pet"} — {a.reason ?? "Visit"}
												</strong>
												<span>
													{formatDate(a.date)} · {a.vet ?? "Vet"}
												</span>
											</div>

											{a.vetNotes ? (
												<p className="client-record-preview">
													{a.vetNotes.length > 90
														? a.vetNotes.slice(0, 90) + "…"
														: a.vetNotes}
												</p>
											) : (
												<span className="client-record-nonotes">
													No notes recorded
												</span>
											)}

											<button
												className="client-record-view"
												type="button"
												onClick={() => setViewing(a)}
											>
												View record
											</button>
										</article>
									);
								})}
							</div>
						)}
					</section>
				</>
			)}

			{viewing && (
				<ClientRecordView record={viewing} onClose={() => setViewing(null)} />
			)}
		</>
	);
}

export default ClientMedicalRecords;
