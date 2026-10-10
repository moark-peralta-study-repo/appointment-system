import { useVets } from "../../hooks/useAdminData";
import { initials } from "../../utils/admin";
import VetCard from "./VetCard";

// Rendered from GET /vets (the same directory the booking wizard uses), so
// the home page reflects the actual clinic roster — add or deactivate a
// vet in the admin dashboard and it shows up / disappears here.
function Veterinarians() {
	const { data: vets = [], isPending } = useVets();

	return (
		<section className="vets" id="vets">
			<div className="section-container">
				<div className="section-heading">
					<span>OUR VETERINARIANS</span>

					<h2>Meet your pet's care team.</h2>

					<p>
						Experienced professionals who treat every patient with patience,
						respect, and care.
					</p>
				</div>

				<div className="vet-grid">
					{isPending && (
						<p className="admin-panel-empty" style={{ gridColumn: "1/-1" }}>
							Loading veterinarians…
						</p>
					)}

					{vets.map((v) => (
						<VetCard
							key={v._id}
							image={v.image}
							initial={initials(v.name)}
							name={v.name}
							specialty={v.specialty}
							bio={v.bio}
						/>
					))}

					{!isPending && vets.length === 0 && (
						<p className="admin-panel-empty" style={{ gridColumn: "1/-1" }}>
							Our team is being updated — check back soon.
						</p>
					)}
				</div>
			</div>
		</section>
	);
}

export default Veterinarians;
