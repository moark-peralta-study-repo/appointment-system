import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useUsers, usePets, useAppointments } from "../../hooks/useAdminData";
import { formatDate, initials } from "../../utils/admin";

function PetOwners() {
	const { data: users = [], isPending } = useUsers();
	const { data: pets = [] } = usePets();
	const { data: appointments = [] } = useAppointments();

	// Pet counts + most recent appointment per owner.
	const petCount = {};
	const lastAppt = {};
	for (const p of pets) {
		petCount[p.owner] = (petCount[p.owner] || 0) + 1;
	}
	for (const a of appointments) {
		const d = new Date(a.date).getTime();
		if (!lastAppt[a.owner] || d > lastAppt[a.owner]) lastAppt[a.owner] = d;
	}

	const owners = users
		.filter((u) => u.role === "user")
		.map((u) => ({
			...u,
			pets: petCount[u._id] || 0,
			lastAppointment: lastAppt[u._id] ? formatDate(lastAppt[u._id]) : "No visits yet",
			initials: initials(u.name),
			status: "Active",
		}));

	return (
		<>
			<AdminPageHeader
				eyebrow="CLINIC MANAGEMENT"
				title="Pet Owners"
				description="Manage client information and their registered pets."
				actions={
					<button className="admin-primary-button" type="button">
						+ Add Pet Owner
					</button>
				}
			/>

			{/* OWNER SUMMARY */}

			<section className="owner-summary">
				<div className="owner-summary-card">
					<div className="owner-summary-icon blue">
						👥
					</div>

					<div>
						<span>Total Pet Owners</span>
						<strong>
						{isPending ? (
							<span className="mini-spinner" />
						) : (
							owners.length
						)}
					</strong>
					</div>
				</div>

				<div className="owner-summary-card">
					<div className="owner-summary-icon green">
						✓
					</div>

					<div>
						<span>Active Owners</span>
						<strong>{owners.length}</strong>
					</div>
				</div>

				<div className="owner-summary-card">
					<div className="owner-summary-icon yellow">
						✦
					</div>

					<div>
						<span>With Appointments</span>
						<strong>
							{owners.filter((o) => o.pets > 0).length}
						</strong>
					</div>
				</div>

				<div className="owner-summary-card">
					<div className="owner-summary-icon soft-blue">
						🐾
					</div>

					<div>
						<span>Registered Pets</span>
						<strong>{pets.length}</strong>
					</div>
				</div>
			</section>

			{/* OWNER TABLE */}

			<section className="admin-panel owners-page-panel">
				<div className="owners-toolbar">
					<div className="owner-search">
						<span>⌕</span>

						<input
							type="text"
							placeholder="Search owner, email, or phone..."
						/>
					</div>

					<div className="owner-filters">
						<select defaultValue="all">
							<option value="all">All Status</option>
							<option value="active">Active</option>
						</select>
					</div>
				</div>

				<div className="owners-table-wrapper">
					<table className="owners-table">
						<thead>
							<tr>
								<th>PET OWNER</th>
								<th>CONTACT</th>
								<th>PETS</th>
								<th>LAST APPOINTMENT</th>
								<th>STATUS</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{isPending && (
								<tr>
									<td colSpan={6} className="admin-panel-empty">
										Loading owners…
									</td>
								</tr>
							)}

							{owners.map((owner) => (
								<tr key={owner._id}>
									<td>
										<div className="owner-table-info">
											<div className="owner-avatar">
												{owner.initials}
											</div>

											<div>
												<strong>{owner.name}</strong>
												<span>{owner.email}</span>
											</div>
										</div>
									</td>

									<td>
										<span className="owner-phone">
											{owner.phone || "—"}
										</span>
									</td>

									<td>
										<span className="owner-pet-count">
											🐾 {owner.pets}
										</span>
									</td>

									<td>{owner.lastAppointment}</td>

									<td>
										<span
											className={`owner-status ${
												owner.status === "Active"
													? "active"
													: "inactive"
											}`}
										>
											{owner.status}
										</span>
									</td>

									<td>
										<button
											className="owner-view-button"
											type="button"
										>
											View
										</button>
									</td>
								</tr>
							))}

							{owners.length === 0 && !isPending && (
								<tr>
									<td colSpan={6} className="admin-panel-empty">
										No pet owners registered yet.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* FOOTER */}

				<div className="owners-table-footer">
					<span>Showing {owners.length} of {owners.length} pet owners</span>

					<div className="owner-pagination">
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

export default PetOwners;
