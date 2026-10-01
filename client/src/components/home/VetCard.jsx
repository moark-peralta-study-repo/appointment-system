import { MdOutlineArrowOutward } from "react-icons/md";

function VetCard({ image, name, specialty }) {
	return (
		<div className="vet-card">
			<div className="vet-photo">
				<img src={image} alt={name} />

				<span className="vet-badge">VET</span>
			</div>

			<div className="vet-info">
				<div className="vet-specialty">{specialty}</div>

				<h3>{name}</h3>

				<p>
					Dedicated to providing thoughtful, personalized care for every
					patient.
				</p>

				<div className="vet-footer">
					<span>Meet your veterinarian</span>

					<span className="vet-arrow">
						<MdOutlineArrowOutward />
					</span>
				</div>
			</div>
		</div>
	);
}

export default VetCard;
