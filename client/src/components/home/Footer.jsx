import logo from "../../assets/logo/pink-paws-mark-sq-256.png";

function Footer() {
	return (
		<footer className="footer">
			<div className="footer-inner">
				<div className="footer-brand">
					<div className="footer-brand-logo">
						<img src={logo} alt="Pink Paws" />
						<span className="footer-brand-name">Pink Paws</span>
					</div>

					<p>
						Compassionate veterinary care for the pets who mean the most to you.
					</p>
				</div>

				<div>
					<h3>Explore</h3>

					<a href="#services">Services</a>

					<a href="#pets">Pet Care</a>

					<a href="#vets">Veterinarians</a>

					<a href="#visit">Visit Us</a>
				</div>

				<div>
					<h3>Client</h3>

					<a href="#home">Client Login</a>

					<a href="#home">Appointments</a>

					<a href="#pets">Pet Records</a>
				</div>

				<div>
					<h3>Contact</h3>

					<a href="#home">0917 123 4567</a>

					<a href="#visit">Quezon City</a>

					<a href="#home">info@pinkpaws.com</a>
				</div>
			</div>

			<div className="footer-bottom">
				© 2026 Pink Paws. All rights reserved.
			</div>
		</footer>
	);
}

export default Footer;
