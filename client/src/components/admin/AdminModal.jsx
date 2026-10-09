import { useEffect } from "react";
import { FiX } from "react-icons/fi";

// Overlay + centered dialog for the admin portal. Closes on overlay click
// and Escape. `footer` renders into the sticky action bar.
function AdminModal({ eyebrow, title, onClose, footer, children, wide }) {
	useEffect(() => {
		const onKey = (e) => e.key === "Escape" && onClose?.();
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);

	return (
		<div
			className="admin-modal-overlay"
			onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
		>
			<div className={`admin-modal${wide ? " admin-modal-wide" : ""}`} role="dialog" aria-modal="true">
				<div className="admin-modal-header">
					<div>
						{eyebrow && <p className="admin-eyebrow">{eyebrow}</p>}
						<h2>{title}</h2>
					</div>

					<button className="admin-modal-close" type="button" onClick={onClose} aria-label="Close">
						<FiX size={15} />
					</button>
				</div>

				<div className="admin-modal-body">{children}</div>

				{footer && <div className="admin-modal-footer">{footer}</div>}
			</div>
		</div>
	);
}

export default AdminModal;
