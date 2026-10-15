import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true },
		password: { type: String, required: true, minlength: 6, select: false },
		role: { type: String, enum: ["user", "vet", "staff", "admin"], default: "user" },
		phone: String,
		// Email verification (guidelines: OTP expires in 15 minutes).
		// Only the SHA-256 hash is stored — never the plaintext OTP.
		isVerified: { type: Boolean, default: false },
		otpHash: { type: String, select: false },
		otpExpiresAt: Date,
		// Rate-limit resend: don't spam an inbox one OTP per second.
		otpSentAt: Date,
		// Password reset — hash of the signed reset token, cleared on use.
		resetTokenHash: { type: String, select: false },
	},
	{ timestamps: true },
);

userSchema.pre("save", async function () {
	if (!this.isModified("password")) return;
	this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (entered) {
	return await bcrypt.compare(entered, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
