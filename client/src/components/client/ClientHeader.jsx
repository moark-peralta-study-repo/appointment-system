// Reusable header for the client portal pages — same markup/classes as
// the admin pages so the chrome matches. Pages pass their own title,
// subtitle and (optional) header actions (e.g. "Book an appointment").
function ClientHeader({
	eyebrow = "MUTUALS PAWS VETERINARY CLINIC",
	title,
	subtitle,
	actions,
}) {
	return (
		<header className="admin-header">
			<div>
				<p className="admin-eyebrow">{eyebrow}</p>
				<h1>{title}</h1>
				{subtitle && <p className="admin-header-text">{subtitle}</p>}
			</div>

			<div className="admin-header-actions">{actions}</div>
		</header>
	);
}

export default ClientHeader;
