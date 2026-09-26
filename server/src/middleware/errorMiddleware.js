export const notFound = (_, res) => {
	res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (err, req, res, next) => {
	let status = err.status || 500;
	if (err.name === "ValidationError") status = 400;
	res.status(status).json({ message: err.message });
};
