// Shared layout for transactional emails (OTP, password reset).
// Minimal inline styles so it renders in every mail client + the MailDev inbox.

function esc(s) {
	return String(s).replace(/[&<>\"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

export function emailLayout({ title, code, lines, button, footer }) {
	const body = lines.map((l) => `<p style="margin:0 0 12px;line-height:1.55">${l}</p>`).join("");
	const btn = button
		? `<div style="text-align:center;margin:8px 0 16px"><a href="${button.href}" style="display:inline-block;background:#e21990;color:#fff;text-decoration:none;font-weight:bold;font-size:14px;padding:11px 26px;border-radius:8px">${button.label}</a></div>`
		: "";
	return `
	<div style="max-width:480px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#2b2b2b">
		<div style="background:#fbe0f1;border-radius:10px 10px 0 0;padding:18px 24px">
			<strong style="color:#e21990;font-size:15px">Pink Paws</strong>
			<span style="color:#8a8a8a;font-size:13px"> · Veterinary Clinic</span>
		</div>
		<div style="border:1px solid #eee;border-top:none;padding:24px;border-radius:0 0 10px 10px">
			<h2 style="margin:0 0 14px;font-size:17px">${esc(title)}</h2>
			${code ? `<div style="font-size:26px;letter-spacing:6px;font-weight:bold;background:#fdf2fa;border:1px dashed #f3b6dd;border-radius:8px;text-align:center;padding:12px;margin:0 0 16px">${esc(code)}</div>` : ""}
			${btn}
			${body}
			${footer ? `<p style="color:#999;font-size:12px;margin-top:20px">${esc(footer)}</p>` : ""}
		</div>
	</div>`;
}
