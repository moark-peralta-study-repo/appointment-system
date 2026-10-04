import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useAppointments, useUsers } from "../../hooks/useAdminData";
import { formatDate, initials } from "../../utils/admin";

function MedicalRecords() {
	const { data: appointments = [], isPending } = useAppointments();
	const { data: users = [] } = useUsers();

	const ownersById = Object.fromEntries(users.map((u) => [u._id, u]));

	// Medical records = completed visits (per the domain model, a record is
	// an appointment that happened — the reason is the record type,
	// vetNotes the visit note). Sorted most-recent first.
	const records = appointments
		.filter((a) => a.status === "completed")
		.sort((x, y) => new Date(y.date) - new Date(x.date))
		.map((a) => ({
			_id: a._id,
			patient: a.pet?.name ?? "Unknown",
			species: a.pet?.breed ?? a.pet?.species ?? "—",
			owner: ownersById[a.owner]?.name ?? "—",
			veterinarian: a.vet ?? "—",
			recordType: a.reason ?? "—",
			date: formatDate(a.date),
			status: "Completed",
			initials: initials(a.pet?.name),
			notes: a.vetNotes,
		}));

	const completedCount = records.length;
	const withNotes = records.filter((r) => r.notes).length;
	const thisMonth = records.filter((r) => {
		const d = new Date(r.date);
		const now = new Date();
		return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
	}).length;

	return (
		<>
			<AdminPageHeader
				eyebrow="PATIENT CARE"
				title="Medical Records"
				description="Review and manage medical records for registered patients."
				actions={
					<button className="admin-primary-button" type="button">
						+ New Medical Record
					</button>
				}
			/>

			{/* SUMMARY */}

			<section className="medical-summary">
				<div className="medical-summary-card">
					<div className="medical-summary-icon blue">📋</div>

					<div>
						<span>Total Records</span>
						<strong>{isPending ? "…" : completedCount}</strong>
					</div>
				</div>

				<div className="medical-summary-card">
					<div className="medical-summary-icon green">✓</div>

					<div>
						<span>With Visit Notes</span>
						<strong>{withNotes}</strong>
					</div>
				</div>

				<div className="medical-summary-card">
					<div className="medical-summary-icon yellow">↻</div>

					<div>
						<span>This Month</span>
						<strong>{thisMonth}</strong>
					</div>
				</div>

				<div className="medical-summary-card">
					<div className="medical-summary-icon soft-blue">✦</div>

					<div>
						<span>Completed Visits</span>
						<strong>{completedCount}</strong>
					</div>
				</div>
			</section>

			{/* RECORDS PANEL */}

			<section className="admin-panel medical-records-panel">
				<div className="medical-toolbar">
					<div className="medical-search">
						<span>⌕</span>

						<input
							type="text"
							placeholder="Search patient, owner, or record..."
						/>
					</div>

					<div className="medical-filters">
						<select defaultValue="all">
							<option value="all">All Record Types</option>
							<option value="checkup">General Check-up</option>
							<option value="vaccination">Vaccination</option>
							<option value="consultation">Consultation</option>
							<option value="dental">Dental Cleaning</option>
							<option value="surgery">Surgery Follow-up</option>
							<option value="wellness">Wellness Exam</option>
						</select>

						<select defaultValue="all">
							<option value="all">All Records</option>
							<option value="completed">Completed</option>
						</select>
					</div>
				</div>

				<div className="medical-table-wrapper">
					<table className="medical-table">
						<thead>
							<tr>
								<th>PATIENT</th>
								<th>OWNER</th>
								<th>VETERINARIAN</th>
								<th>RECORD TYPE</th>
								<th>DATE</th>
								<th>STATUS</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{isPending && (
								<tr>
									<td colSpan={7} className="admin-panel-empty">
										Loading medical records…
									</td>
								</tr>
							)}

							{records.map((record) => (
								<tr key={record._id}>
									<td>
										<div className="medical-patient-info">
											<div className="medical-patient-avatar">
												{record.initials}
											</div>

											<div>
												<strong>{record.patient}</strong>
												<span>{record.species}</span>
											</div>
										</div>
									</td>

									<td>
										<span className="medical-owner">{record.owner}</span>
									</td>

									<td>{record.veterinarian}</td>

									<td>
										<span className="medical-record-type">
											{record.recordType}
										</span>
									</td>

									<td>{record.date}</td>

									<td>
										<span className="medical-status completed">
											{record.status}
										</span>
									</td>

									<td>
										<button
											className="medical-view-button"
											type="button"
											title={record.notes || "No visit notes"}
										>
											View
										</button>
									</td>
								</tr>
							))}

							{records.length === 0 && !isPending && (
								<tr>
									<td colSpan={7} className="admin-panel-empty">
										No completed visits yet. Records appear once an
										appointment is marked completed.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				<div className="medical-table-footer">
					<span>Showing {records.length} of {records.length} medical records</span>

					<div className="medical-pagination">
						<button type="button">‹</button>

						<button className="active" type="button">
							1
						</button>

						<button type="button">›</button>
					</div>
				</div>
			</section>
		</>
	);
}

export default MedicalRecords;
