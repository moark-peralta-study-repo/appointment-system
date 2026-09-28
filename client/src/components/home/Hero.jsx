import { Link } from "react-router-dom";

import bruno from "../../assets/images/pets/bruno.jpeg";

function Hero() {
	return (
		<section className="hero" id="home">
			<div className="hero-inner">
				<div className="hero-text">
					<div className="eyebrow">✦ CARING FOR PETS, CARING FOR FAMILY</div>

					<h1>
						Better care for
						<span> happier paws.</span>
					</h1>

					<p>
						Compassionate veterinary care for the pets who are part of your
						family. From everyday wellness to unexpected moments, we're here to
						help them live their happiest, healthiest lives.
					</p>

					<div className="hero-buttons">
						<Link to="/book-appointment" className="primary-button">
							Book an Appointment
							<span>→</span>
						</Link>

						<button type="button" className="secondary-button">
							Explore Services
						</button>
					</div>

					<div className="rating">
						<span className="stars">★★★★★</span>

						<strong>4.9/5</strong>

						<span>trusted by pet parents</span>
					</div>
				</div>

				<div className="hero-photo">
					<div className="hero-photo-box">
						<img src={bruno} alt="Bruno" />
					</div>

					<div className="hero-stat">
						<strong>98.6%</strong>

						<span>of pet parents would recommend Mutuals Paws</span>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Hero;
