import { passwordStrengthScore } from "../../utils/validate";

const LABELS = ["Too short", "Weak", "Fair", "Strong", "Excellent"];
const COLORS = ["#d9d9d9", "#e05252", "#e0a252", "#52b788", "#2d8a5f"];

/**
 * Live strength meter under a new-password input.
 * 0-4 segments; label + color follow the score from validate.js.
 */
function PasswordStrength({ password, error }) {
	const score = passwordStrengthScore(password);
	const hidden = !password || error; // error message replaces the meter
	if (hidden) return null;

	return (
		<div className="password-strength" aria-live="polite">
			<div className="password-strength-bars">
				{[0, 1, 2, 3].map((i) => (
					<span
						key={i}
						className="password-strength-seg"
						style={{
							background: i < score ? COLORS[score] : "var(--border-cool, #e5e7eb)",
						}}
					/>
				))}
			</div>
			<span
				className="password-strength-label"
				style={{ color: COLORS[score] || "var(--muted, #8a8a8a)" }}
			>
				{LABELS[score]}
			</span>
		</div>
	);
}

export default PasswordStrength;
