import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import QuickBooking from "../components/home/QuickBooking";
import WhyUs from "../components/home/WhyUs";
import ServicesSection from "../components/home/ServicesSection";
import PetPortal from "../components/home/PetPortal";
import Veterinarians from "../components/home/Veterinarians";
import Testimonials from "../components/home/Testimonials";
import Emergency from "../components/home/Emergency";
import Footer from "../components/home/Footer";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { isPortal } from "../utils/roles";

function Home() {
	const { user, isSettled } = useAuth();

	// Signed-in users don't need the marketing page: send them straight to
	// their own portal (clients → /client, staff → /admin). Wait for
	// isSettled so guests don't flash-redirect mid-load.
	if (isSettled && user) {
		return <Navigate to={isPortal(user.role) ? "/admin" : "/client/dashboard"} replace />;
	}

	return (
		<div className="home-page">
			<Navbar />

			<main>
				<Hero />
				<QuickBooking />
				<WhyUs />
				<ServicesSection />
				<PetPortal />
				<Veterinarians />
				<Testimonials />
				<Emergency />
			</main>

			<Footer />
		</div>
	);
}

export default Home;
