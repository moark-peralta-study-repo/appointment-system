import logo2 from "../../assets/logo/pink-paws-full.png";

function BookingHeader({ right }) {
	return (
		<header className="booking-header">
			<a href="/" className="logo">
				<img src={logo2} alt="Pink Paws" />
			</a>

			{right}
		</header>
	);
}

export default BookingHeader;
