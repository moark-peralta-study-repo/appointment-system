import ReviewCard from "./ReviewCard";

function Testimonials() {
	return (
		<section className="testimonials">
			<div className="section-container">
				<div className="section-heading">
					<span>PET PARENTS</span>

					<h2>Loved by our community.</h2>

					<p>A few words from the people who trust us with their pets.</p>
				</div>

				<div className="testimonial-grid">
					<ReviewCard
						text="The staff were so gentle with Mochi. We both felt comfortable from the moment we walked in."
						name="Maria L."
						pet="Mochi's mom"
					/>

					<ReviewCard
						text="I love being able to see my pet's records and appointments online. It makes everything so much easier."
						name="James R."
						pet="Luna's dad"
					/>

					<ReviewCard
						text="The veterinarians took their time explaining everything. I never felt rushed during our visit."
						name="Sofia C."
						pet="Cookie's mom"
					/>
				</div>
			</div>
		</section>
	);
}

export default Testimonials;
