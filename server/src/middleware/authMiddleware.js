import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protectAuth(req, res, next) {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];

			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			req.user = await User.findById(decoded.id);
			next();
		} catch {
			res.status(401).json({ message: "Not authorized, token failed" });
			return;
		}
	}

	if (!token) {
		res.status(401).json({ message: "Not authorized, no token" });
	}
}

export function authorize(...roles) {
	return (req, res, next) => {
		if (roles.includes(req.user.role)) {
			next();
		} else {
			res.status(403).json({ message: "Not authorized, role required" });
		}
	};
}
