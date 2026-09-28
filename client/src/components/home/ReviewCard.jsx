function ReviewCard({ text, name, pet }) {
	return (
		<div className="review-card">
			<div className="review-top">
				<div className="review-stars">★★★★★</div>

				<span className="review-quote">“</span>
			</div>

			<p>{text}</p>

			<div className="review-person">
				<div className="review-avatar">{name.charAt(0)}</div>

				<div>
					<strong>{name}</strong>

					<span>{pet}</span>
				</div>
			</div>
		</div>
	);
}

export default ReviewCard;
