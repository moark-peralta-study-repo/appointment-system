function AdminPageHeader({ eyebrow, title, description, actions = null }) {
	return (
		<header className="admin-page-header">
			<div>
				<p className="admin-eyebrow">{eyebrow}</p>
				<h1>{title}</h1>
				<p>{description}</p>
			</div>

			{actions}
		</header>
	);
}

export default AdminPageHeader;
