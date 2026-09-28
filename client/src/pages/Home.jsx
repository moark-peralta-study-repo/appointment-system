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

function Home() {
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
