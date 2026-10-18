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

/* ---------------- PAGE ---------------- */
// Per-pet history: pick one of YOUR pets, see every completed visit the
// clinic recorded for that pet (structured record + vet notes).
function ClientMedicalRecords() {
	const { data: appointments = [], isPending } = useMyAppointments();
	const { data: pets = [] } = useMyPets();
	const [viewing, setViewing] = useState(null);
	const [selectedPetId, setSelectedPetId] = useState(null);

	// Group completed visits by pet.
	const recordsByPet = useMemo(() => {
		const map = {};
		for (const a of appointments) {
			if (a.status !== "completed" || !a.pet?._id) continue;
			(map[a.pet._id] ??= []).push(a);
		}
		for (const k in map) map[k].sort((x, y) => new Date(y.date) - new Date(x.date));
		return map;
	}, [appointments]);

	const petsWithRecords = useMemo(
		() => pets.filter((p) => recordsByPet[p._id]?.length),
		[pets, recordsByPet],
	);

	const activePetId = selectedPetId ?? petsWithRecords[0]?._id ?? null;
	const activePet = pets.find((p) => p._id === activePetId) ?? null;
	const activeRecords = activePetId ? recordsByPet[activePetId] ?? [] : [];

	const completedTotal = appointments.filter((a) => a.status === "completed").length;
	const withNotes = appointments.filter(
		(a) => a.status === "completed" && (a.vetNotes || a.medicalRecord?.findings),
	).length;

	return (
		<>
			<ClientHeader
				title="Medical Records"
				subtitle="Pick one of your pets to review their visit history."
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
								<strong>{completedTotal}</strong>
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
						{/* Pet picker */}
						{pets.length === 0 ? (
							<p className="admin-panel-empty">
								Add a pet first — records appear here once your vet
								completes a visit.
							</p>
						) : (
							<>
								<div
									className="client-records-toolbar"
									style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
								>
									{pets.map((p) => {
										const active = p._id === activePetId;
										const n = recordsByPet[p._id]?.length ?? 0;
										return (
											<button
												key={p._id}
												type="button"
												aria-current={active}
												onClick={() => setSelectedPetId(p._id)}
												className={
													active
														? "client-pet-picker active"
														: "client-pet-picker"
												}
											>
												<SpeciesIcon species={p.species} size={16} />
												<span>{p.name}</span>
												{active && (
													<em style={{ fontStyle: "normal", fontSize: 12 }}>
														{n} visit{n === 1 ? "" : "s"}
													</em>
												)}
											</button>
										);
									})}
								</div>

								{/* Records for the selected pet */}
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: 12,
										marginTop: 16,
									}}
								>
									{!activePet ? (
										<p className="admin-panel-empty">
											Select a pet to view their history.
										</p>
									) : activeRecords.length === 0 ? (
										<p className="admin-panel-empty">
											No completed visits for {activePet.name} yet —
											records appear here once your vet finishes a
											visit.
										</p>
									) : (
										activeRecords.map((a) => (
											<article className="client-record-card" key={a._id}>
												<div className="client-appt-avatar">
													<SpeciesIcon species={a.pet?.species} />
												</div>
												<div className="client-record-main">
													<strong>
														{a.reason ?? "Visit"}
													</strong>
													<span>
														{formatDate(a.date)} · {a.vet ?? "Vet"}
													</span>
												</div>

												{a.medicalRecord?.findings ? (
													<p className="client-record-preview">
														{a.medicalRecord.findings.length > 90
															? a.medicalRecord.findings.slice(0, 90) + "…"
															: a.medicalRecord.findings}
													</p>
												) : a.vetNotes ? (
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
										))
									)}
								</div>
							</>
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
