import "dotenv/config";
import connectDB from "./src/config/database.js";
import User from "./src/models/User.js";

await connectDB();

const u = await User.findById("aaaaaaaaaaaaaaaaaaaaaaaa");
if (!u) {
	console.log("seed user not found");
	process.exit(0);
}
u.password = "admin123";
await u.save();
console.log("password set for", u.email, "match:", await u.matchPassword("admin123"));
process.exit(0);
