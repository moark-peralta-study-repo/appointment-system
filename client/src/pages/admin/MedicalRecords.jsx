import { useMemo, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useAppointments, usePets, useUsers } from "../../hooks/useAdminData";
import { formatDate } from "../../utils/admin";
import AdminVisitNoteForm from "../../components/admin/medical/VisitNoteForm";
import { useAuth } from "../../context/useAuth";
import { isClinical } from "../../utils/roles";
import MedicalRecordView from "../../components/admin/medical/MedicalRecordView";
import { SpeciesIcon } from "../../components/shared/Species";
import { FaClipboardList } from "react-icons/fa";
import { PiStar } from "react-icons/pi";
import { FiCheck, FiSearch } from "react-icons/fi";

// A completed appointment IS a visit record (it carries the structured
// medicalRecord). This page groups records by PET: pick a patient on the
// left, read their full clinical history on the right.
function MedicalRecords() {
	const { user } = useAuth();
	const { data: appointments = [], isPending } = useAppointments();
	const { data: pets = [] } = usePets();
	const { data: users = [] } = useUsers();

	const [search, setSearch] = useState("");
	const [showNew, setShowNew] = useState(false);
	const [viewing, setViewing] = useState(null);
	// Default to the first patient that has a record.
	const [selectedPetId, setSelectedPetId] = useState(null);

	const ownersById = Object.fromEntries(users.map((u) => [u._id, u]));

	// Records = completed visits, grouped by pet.
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

	// Active selection: explicit pick, else the first pet with records.
	const activePetId = selectedPetId ?? petsWithRecords[0]?._id ?? null;
	const activePet = pets.find((p) => p._id === activePetId) ?? null;
	const activeRecords = activePetId ? recordsByPet[activePetId] ?? [] : [];

	const filteredPatients = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return petsWithRecords;
		return petsWithRecords.filter((p) => {
			const ownerName = ownersById[p.owner]?.name ?? "";
			return `${p.name} ${p.breed ?? ""} ${ownerName}`.toLowerCase().includes(q);
		});
	}, [petsWithRecords, search, ownersById]);

	const completedCount = appointments.filter(
		(a) => a.status === "completed",
	).length;
	const recordCount = Object.values(recordsByPet).reduce((n, arr) => n + arr.length, 0);
	const withRecords = petsWithRecords.length;

	// Build the record object for the view modal (shape used by MedicalRecordView).
	const toView = (a) => ({
		_id: a._id,
		patient: a.pet?.name ?? "Unknown",
		species: a.pet?.breed ?? a.pet?.species ?? "—",
		owner: ownersById[a.owner]?.name ?? "—",
		veterinarian: a.vet ?? "—",
		recordType: a.reason ?? "—",
		date: formatDate(a.date),
		status: "Completed",
		notes: a.vetNotes,
		medicalRecord: a.medicalRecord,
	});

	const ownerName = (id) => ownersById[id]?.name ?? "—";

	return (
		<>
			<AdminPageHeader
				eyebrow="PATIENT CARE"
				title="Medical Records"
				description="Per-patient clinical history — select a patient to view their visits."
				actions={
					isClinical ? (
						<button
							className="admin-primary-button"
							type="button"
							onClick={() => setShowNew(true)}
						>
							+ New Medical Record
						</button>
					) : null
				}
			/>

			{/* SUMMARY */}
			<section className="medical-summary">
				<div className="medical-summary-card">
					<div className="medical-summary-icon blue">
						<FaClipboardList size={20} />
					</div>

					<div>
						<span>Total Records</span>
						<strong>
							{isPending ? <span className="mini-spinner" /> : recordCount}
						</strong>
					</div>
				</div>

				<div className="medical-summary-card">
					<div className="medical-summary-icon green">
						<FiCheck size={20} />
					</div>

					<div>
						<span>Completed Visits</span>
						<strong>{completedCount}</strong>
					</div>
				</div>

				<div className="medical-summary-card">
					<div className="medical-summary-icon soft-blue">
						<PiStar size={20} />
					</div>

					<div>
						<span>Pets on File</span>
						<strong>{withRecords}</strong>
					</div>
				</div>
			</section>

			{/* MASTER / DETAIL */}
			<section
				className="admin-panel medical-records-panel"
				style={{
					display: "grid",
					gridTemplateColumns: "280px 1fr",
					gap: 0,
					minHeight: 480,
				}}
			>
				{/* PATIENT LIST */}
				<div
					style={{
						borderRight: "1px solid var(--border, #eee)",
						display: "flex",
						flexDirection: "column",
						minHeight: 0,
					}}
				>
					<div className="medical-toolbar" style={{ padding: "14px 14px 8px" }}>
						<div className="medical-search">
							<FiSearch size={15} />

							<input
								type="text"
								placeholder="Search patient or owner…"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
					</div>
					<div style={{ overflowY: "auto", flex: 1 }}>
						{isPending ? (
							<p className="admin-panel-empty">Loading patients…</p>
						) : filteredPatients.length === 0 ? (
							<p className="admin-panel-empty">
								No patients with records yet.
							</p>
						) : (
							<ul style={{ listStyle: "none", margin: 0, padding: 6 }}>
								{filteredPatients.map((p) => {
									const active = p._id === activePetId;
									const n = recordsByPet[p._id]?.length ?? 0;
									return (
										<li key={p._id}>
											<button
												type="button"
												onClick={() => setSelectedPetId(p._id)}
												aria-current={active}
												style={{
													width: "100%",
													display: "flex",
													alignItems: "center",
													gap: 10,
													padding: "10px 12px",
													marginBottom: 4,
													border: "1px solid",
													borderColor: active
														? "var(--primary, #e21990)"
														: "var(--border, #eee)",
													background: active
														? "var(--surface-2, #faf7fb)"
														: "white",
													borderRadius: 10,
													cursor: "pointer",
													textAlign: "left",
												}}
											>
												<span className="medical-patient-avatar">
													<SpeciesIcon species={p.species} size={18} />
												</span>
												<span style={{ flex: 1, minWidth: 0 }}>
													<strong
														style={{
															display: "block",
															whiteSpace: "nowrap",
															overflow: "hidden",
															textOverflow: "ellipsis",
														}}
													>
														{p.name}
													</strong>
													<span style={{ fontSize: 12, color: "var(--muted, #8a8a8a)" }}>
														{p.breed ?? p.species}
													</span>
												</span>
												<span
													style={{
														fontSize: 12,
														fontWeight: 700,
														color: "var(--primary, #e21990)",
													}}
												>
													{n}
												</span>
											</button>
										</li>
									);
								})}
							</ul>
						)}
					</div>
				</div>

				{/* PATIENT DETAIL */}
				<div style={{ padding: 18, overflowY: "auto" }}>
					{!activePet ? (
						<p className="admin-panel-empty">
							Select a patient to view their medical history.
						</p>
					) : (
						<>
							{/* patient header */}
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: 14,
									padding: "12px 16px",
									background: "var(--surface-2, #faf7fb)",
									borderRadius: 12,
									marginBottom: 16,
								}}
							>
								<span className="medical-patient-avatar">
									<SpeciesIcon species={activePet.species} size={22} />
								</span>
								<div style={{ flex: 1 }}>
									<strong style={{ fontSize: 18 }}>{activePet.name}</strong>
									<div style={{ fontSize: 13, color: "var(--muted, #8a8a8a)" }}>
										{[
											activePet.breed ?? activePet.species,
											activePet.age != null ? `${activePet.age} yrs` : null,
											activePet.gender,
										]
											.filter(Boolean)
											.join(" · ")}
									</div>
								</div>
								<div style={{ textAlign: "right", fontSize: 13 }}>
									<span
										style={{
											display: "block",
											color: "var(--muted, #8a8a8a)",
										}}
									>
										Owner
									</span>
									<strong>{ownerName(activePet.owner)}</strong>
								</div>
							</div>

							{/* record timeline */}
							{activeRecords.length === 0 ? (
								<p className="admin-panel-empty">
									No completed visits recorded for {activePet.name} yet.
								</p>
							) : (
								<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
									{activeRecords.map((a) => {
										const rec = a.medicalRecord;
										const hasStructured = Boolean(rec?.findings);
										return (
											<article
												key={a._id}
												style={{
													border: "1px solid var(--border, #eee)",
													borderRadius: 12,
													padding: "14px 16px",
												}}
											>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														justifyContent: "space-between",
														gap: 12,
														marginBottom: 10,
													}}
												>
													<div>
														<strong>
															{formatDate(a.date)} — {a.reason ?? "Visit"}
														</strong>
														<div style={{ fontSize: 12, color: "var(--muted, #8a8a8a)" }}>
															by {a.vet ?? "—"}
														</div>
													</div>
													<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
														{!hasStructured && (
															<span
																style={{
																	fontSize: 11,
																	padding: "2px 8px",
																	borderRadius: 999,
																	background: "var(--surface-2, #f3f0f6)",
																	color: "var(--muted, #8a8a8a)",
																}}
															>
																note only
															</span>
														)}
														<button
															className="medical-view-button"
															type="button"
															onClick={() => setViewing(toView(a))}
														>
															View
														</button>
													</div>
												</div>

												{hasStructured ? (
													<dl
														style={{
															margin: 0,
															display: "grid",
															gridTemplateColumns: "120px 1fr",
															gap: "6px 14px",
														}}
													>
														<dt style={{ color: "var(--muted, #8a8a8a)", fontSize: 12 }}>
															Findings
														</dt>
														<dd style={{ margin: 0, whiteSpace: "pre-wrap" }}>
															{rec.findings}
														</dd>
														{rec.diagnosis && (
															<>
																<dt style={{ color: "var(--muted, #8a8a8a)", fontSize: 12 }}>
																	Diagnosis
																</dt>
																<dd style={{ margin: 0 }}>{rec.diagnosis}</dd>
															</>
														)}
														{rec.treatment && (
															<>
																<dt style={{ color: "var(--muted, #8a8a8a)", fontSize: 12 }}>
																	Treatment
																</dt>
																<dd style={{ margin: 0 }}>{rec.treatment}</dd>
															</>
														)}
														{rec.medications && (
															<>
																<dt style={{ color: "var(--muted, #8a8a8a)", fontSize: 12 }}>
																	Medications
																</dt>
																<dd style={{ margin: 0 }}>{rec.medications}</dd>
															</>
														)}
														{rec.followUp && (
															<>
																<dt style={{ color: "var(--muted, #8a8a8a)", fontSize: 12 }}>
																	Follow-up
																</dt>
																<dd style={{ margin: 0 }}>{rec.followUp}</dd>
															</>
														)}
													</dl>
												) : (
													<p
														style={{
															margin: 0,
															whiteSpace: "pre-wrap",
															color: "var(--muted, #6a6a6a)",
														}}
													>
														{a.vetNotes || "No notes recorded for this visit."}
													</p>
												)}
											</article>
										);
									})}
								</div>
							)}
						</>
					)}
				</div>
			</section>

			{showNew && (
				<AdminVisitNoteForm
					appointments={appointments}
					onClose={() => setShowNew(false)}
				/>
			)}

			{viewing && (
				<MedicalRecordView record={viewing} onClose={() => setViewing(null)} />
			)}
		</>
	);
}

export default MedicalRecords;
