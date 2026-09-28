import luna from "../../assets/images/pets/luna.jpeg";
import bruno from "../../assets/images/pets/bruno.jpeg";
import cookie from "../../assets/images/pets/cookie.jpeg";

import VetCard from "./VetCard";

function Veterinarians() {
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
					<VetCard
						image={luna}
						name="Dr. Evelyn Dane"
						specialty="General Practice"
					/>

					<VetCard
						image={bruno}
						name="Dr. Alex Mercer"
						specialty="Surgery & Diagnostics"
					/>

					<VetCard
						image={cookie}
						name="Dr. Elena Rostova"
						specialty="Internal Medicine"
					/>
				</div>
			</div>
		</section>
	);
}

export default Veterinarians;
