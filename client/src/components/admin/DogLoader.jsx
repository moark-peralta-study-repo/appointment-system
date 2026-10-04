// Big "resting dog" loading animation.
// Source: uiverse.io/Emmaline-ozi/angry-dragon-5 (MIT).
// Styling: App.css — the ".dog-loader" section.
function DogLoader() {
	return (
		<div className="dog-loader" role="status" aria-label="Loading">
			<div className="dog">
				<div className="dog__paws">
					<div className="dog__bl-leg leg">
						<div className="dog__bl-paw paw" />
						<div className="dog__bl-top top" />
					</div>
					<div className="dog__fl-leg leg">
						<div className="dog__fl-paw paw" />
						<div className="dog__fl-top top" />
					</div>
					<div className="dog__fr-leg leg">
						<div className="dog__fr-paw paw" />
						<div className="dog__fr-top top" />
					</div>
				</div>

				<div className="dog__body">
					<div className="dog__tail" />
				</div>

				<div className="dog__head">
					<div className="dog__snout">
						<div className="dog__eyes">
							<div className="dog__eye-l" />
							<div className="dog__eye-r" />
						</div>
					</div>
				</div>

				<div className="dog__head-c">
					<div className="dog__ear-r" />
					<div className="dog__ear-l" />
				</div>
			</div>
		</div>
	);
}

export default DogLoader;
