import ServiceCard from "./ServiceCard";

function ServicesSection() {
	return (
		<section className="services" id="services">
			<div className="section-container">
				<div className="section-heading services-heading">
					<span>OUR SERVICES</span>

					<h2>Here for every stage.</h2>

					<p>
						From preventative care to specialized treatment, we're here when
						your pet needs us.
					</p>
				</div>

				<div className="service-grid">
					<ServiceCard
						icon="♡"
						title="Wellness Exams"
						text="Routine health checks designed to catch concerns early."
						price="From ₱850"
					/>

					<ServiceCard
						icon="✦"
						title="Dental Care"
						text="Professional dental cleaning to support healthy teeth and gums."
						price="From ₱1,200"
					/>

					<ServiceCard
						icon="✚"
						title="Vaccinations"
						text="Essential vaccinations to help protect your pet from illness."
						price="From ₱550"
					/>

					<ServiceCard
						icon="!"
						title="Urgent Care"
						text="Prompt veterinary attention for unexpected health concerns."
						price="Emergency care"
					/>

					<ServiceCard
						icon="⌕"
						title="Diagnostics"
						text="Bloodwork and testing to help our veterinarians understand your pet."
						price="20+ Tests"
					/>

					<ServiceCard
						icon="◆"
						title="Surgery"
						text="Specialized procedures supported by careful monitoring and aftercare."
						price="Consultation"
					/>
				</div>
			</div>
		</section>
	);
}

export default ServicesSection;
