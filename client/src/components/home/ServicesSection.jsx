import ServiceCard from "./ServiceCard";
import { SERVICES } from "../../data/catalog";

// Rendered from the shared service catalog (client/src/data/catalog.js) so
// the home page and the booking form always agree on the menu.
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
					{SERVICES.map((s) => (
						<ServiceCard
							key={s.id}
							icon={s.icon}
							title={s.label}
							text={s.short}
							price={s.price}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

export default ServicesSection;
