import mochi from "../../assets/images/pets/mochi.jpeg";

function PetPortal() {
	return (
		<section className="pet-section" id="pets">
			<div className="pet-inner">
				<div className="pet-text">
					<span className="section-label">YOUR PET'S HEALTH</span>

					<h2>
						Their records,
						<span> always close.</span>
					</h2>

					<p>
						With your Mutuals Paws client portal, you can keep your pet's
						important health information organized and accessible whenever you
						need it.
					</p>

					<ul>
						<li>✓ View medical records</li>

						<li>✓ Keep track of vaccinations</li>

						<li>✓ Manage upcoming appointments</li>

						<li>✓ Update your pet's information</li>
					</ul>

					<button type="button" className="primary-button">
						View Pet Records →
					</button>
				</div>

				<div className="record-wrapper">
					<div className="record-card">
						<div className="record-top">
							<div>
								<span>PET PROFILE</span>

								<h3>Mochi</h3>
							</div>

							<span className="healthy">● Healthy</span>
						</div>

						<div className="record-profile">
							<img src={mochi} alt="Mochi" />

							<div>
								<h3>Mochi</h3>

								<p>Golden Retriever · 3 years old</p>
							</div>
						</div>

						<div className="record-stats">
							<div>
								<span>Last Visit</span>

								<strong>Aug 18</strong>
							</div>

							<div>
								<span>Vaccines</span>

								<strong>Up to date</strong>
							</div>

							<div>
								<span>Next Checkup</span>

								<strong>Nov 18</strong>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default PetPortal;
