import { MdOutlineArrowOutward } from "react-icons/md";

// `image` is optional — the vet directory has no photo field yet, so cards
// without one fall back to a name monogram.
function VetCard({ image, initial, name, specialty, bio }) {
	const tagline =
		bio || "Dedicated to providing thoughtful, personalized care for every patient.";

	return (
		<div className="vet-card">
			<div className="vet-photo">
				{image ? (
					<img src={image} alt={name} />
				) : (
					<span className="vet-photo-initials">{initial}</span>
				)}

				<span className="vet-badge">VET</span>
			</div>

			<div className="vet-info">
				<div className="vet-specialty">{specialty || "Veterinarian"}</div>

				<h3>{name}</h3>

				<p>{tagline}</p>

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
