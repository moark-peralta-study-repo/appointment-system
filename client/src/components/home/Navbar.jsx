import { Link } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";
import logo from "../../assets/logo/happy-paws-logo.png";

function Navbar() {
	return (
		<header className="navbar">
			<div className="navbar-inner">
				<a href="#home" className="logo">
					<img src={logo} alt="Mutuals Paws" />
				</a>

				<nav className="nav-links">
					<a href="#services">Services</a>
					<a href="#pets">Pet Care</a>
					<a href="#vets">Veterinarians</a>
					<a href="#visit">Visit Us</a>
				</nav>

				<div className="nav-right">
					<Link to="/admin/login" className="staff-login-button">
						Staff Login
					</Link>

					<span className="phone">
						<FaPhoneAlt /> 0917 123 4567
					</span>

					<Link to="/client" className="login-button">
						Client Login
					</Link>

					<Link to="/book-appointment" className="book-button">
						Book Appointment
					</Link>
				</div>
			</div>
		</header>
	);
}

export default Navbar;
