import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import ClientHeader from "../../components/client/ClientHeader";
import DogLoader from "../../components/admin/DogLoader";
import { useAuth } from "../../context/useAuth";
import { useMyPets } from "../../hooks/useClientData";
import { initials } from "../../utils/admin";
import { SpeciesIcon } from "../../components/shared/Species";
import AccountSection from "../../components/shared/AccountSection";
import PasswordSection from "../../components/shared/PasswordSection";
import ClientPetForm from "../../components/client/profile/ClientPetForm";
import ClientPetDeleteModal from "../../components/client/profile/ClientPetDeleteModal";

function ClientProfile() {
	const { user, isSettled } = useAuth();
	const { data: pets = [], isPending: petsLoading } = useMyPets();
	const [editingPet, setEditingPet] = useState(null);
	const [addingPet, setAddingPet] = useState(false);
	const [deletingPet, setDeletingPet] = useState(null);

	if (!isSettled) {
		return (
			<div className="admin-loading" style={{ minHeight: "50vh" }}>
				<DogLoader />
			</div>
		);
	}

	return (
		<>
			<ClientHeader
				title="My Profile"
				subtitle="Manage your account and keep your pets' details up to date."
			/>

			<section className="admin-panel client-profile-card">
				<div className="client-profile-id">
					<div className="settings-profile-avatar">{initials(user?.name)}</div>
					<div>
						<strong>{user?.name}</strong>
						<span>{user?.email}</span>
					</div>
				</div>
				<dl className="client-profile-meta">
					<div>
						<dt>Phone</dt>
						<dd>{user?.phone || "Not on file"}</dd>
					</div>
					<div>
						<dt>Account</dt>
						<dd>Pet Owner</dd>
					</div>
					<div>
						<dt>Pets on file</dt>
						<dd>{pets.length}</dd>
					</div>
				</dl>
			</section>

			<AccountSection />

			<PasswordSection />

			<section className="admin-panel client-pets-panel">
				<div className="settings-panel-header">
					<div>
						<h2>My Pets</h2>
						<p>Pets you can book appointments for.</p>
					</div>
					<button
						className="admin-primary-button"
						type="button"
						onClick={() => setAddingPet(true)}
					>
						<FiPlus />
						<span>Add a pet</span>
					</button>
				</div>

				{petsLoading ? (
					<p className="admin-panel-empty">Loading pets…</p>
				) : pets.length === 0 ? (
					<p className="admin-panel-empty">
						No pets yet — add your first furry friend to book a visit.
					</p>
				) : (
					<div className="client-pets-list">
						{pets.map((p) => (
							<article className="client-pet-card" key={p._id}>
								<div className="client-appt-avatar">
									<SpeciesIcon species={p.species} />
								</div>
								<div className="client-pet-main">
									<strong>
										{p.name}{" "}
										<small className="client-pet-gender">
											{p.gender ?? ""}
										</small>
									</strong>
									<span>
										{p.breed ?? p.species ?? "—"}
										{p.age != null ? ` · ${p.age} yrs` : ""}
									</span>
									{p.notes && <p className="client-pet-notes">{p.notes}</p>}
								</div>
								<div className="client-pet-actions">
									<button
										className="row-action confirm"
										type="button"
										onClick={() => setEditingPet(p)}
									>
										Edit
									</button>
									<button
										className="row-action cancel"
										type="button"
										onClick={() => setDeletingPet(p)}
									>
										Remove
									</button>
								</div>
							</article>
						))}
					</div>
				)}
			</section>

			{addingPet && (
				<ClientPetForm pet={null} onClose={() => setAddingPet(false)} />
			)}
			{editingPet && (
				<ClientPetForm pet={editingPet} onClose={() => setEditingPet(null)} />
			)}
			{deletingPet && (
				<ClientPetDeleteModal
					pet={deletingPet}
					onClose={() => setDeletingPet(null)}
				/>
			)}
		</>
	);
}

export default ClientProfile;
