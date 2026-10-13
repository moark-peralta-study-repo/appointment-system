import logo2 from "../../assets/logo/pink-paws-mark-sq-256.png";

function BookingHeader({ right }) {
	return (
		<header className="booking-header">
			<a href="/" className="booking-logo">
				<img src={logo2} alt="Pink Paws" />
			</a>

			{right}
		</header>
	);
}

export default BookingHeader;
