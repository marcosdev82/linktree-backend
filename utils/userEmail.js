import User from "../models/User.js";

export async function ensureEmailIsAvailable(email, res) {
	const normalizedEmail = email.trim().toLowerCase();
	const existingUser = await User.exists({ email: normalizedEmail });

	if (existingUser) {
		res.status(422).json({ message: "E-mail já cadastrado" });
		return null;
	}

	return normalizedEmail;
}