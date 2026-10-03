import { FaArrowRight } from "react-icons/fa";

function ServiceCard({ icon, title, text, price }) {
	return (
		<div className="service-card-new">
			<div className="service-icon-new">{icon}</div>

			<div className="service-content-new">
				<h3>{title}</h3>

				<p>{text}</p>

				<div className="service-bottom-new">
					<span>{price}</span>

					<span className="service-arrow-new">
						<FaArrowRight />
					</span>
				</div>
			</div>
		</div>
	);
}

export default ServiceCard;
