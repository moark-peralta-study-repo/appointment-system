function StatCard({
	label,
	value,
	icon,
	iconStyle,
	change,
	changeText,
	warning,
}) {
	return (
		<div className="stat-card">
			<div className="stat-card-top">
				<span className="stat-label">{label}</span>

				<div className={`stat-icon ${iconStyle}`}>{icon}</div>
			</div>

			<div className="stat-number">{value}</div>

			<div className="stat-footer">
				{warning ? (
					<span className="stat-warning">{change}</span>
				) : (
					<span className="stat-positive">{change}</span>
				)}

				{changeText && <span>{changeText}</span>}
			</div>
		</div>
	);
}

export default StatCard;
