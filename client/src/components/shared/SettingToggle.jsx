// Settings-style toggle row (label + hint + switch). Shared by the admin
// Settings page and the client Settings page — same markup, same CSS.
function SettingToggle({ label, hint, checked, onChange }) {
	return (
		<div className="settings-option">
			<div>
				<strong>{label}</strong>
				<span>{hint}</span>
			</div>
			<label className="settings-toggle">
				<input type="checkbox" checked={checked} onChange={onChange} />
				<span></span>
			</label>
		</div>
	);
}

export default SettingToggle;
