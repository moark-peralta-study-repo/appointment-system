import logo2 from "../../assets/logo/happy-paws-logo-2.png";

function BookingHeader({ right }) {
	return (
		<header className="booking-header">
			<a href="/" className="booking-logo">
				<img src={logo2} alt="Mutuals Paws" />
			</a>

			{right}
		</header>
	);
}

export default BookingHeader;
