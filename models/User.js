import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, trim: true, lowercase: true },
		password: { type: String, required: true },
		slug: { type: String, required: true, unique: true, trim: true },
		avatar: { type: String, default: "" },
		bio: { type: String, default: "" },
		theme: { type: String, default: "default" },
		settings: {
			public: { type: Boolean, default: true },
			language: { type: String, default: "pt-BR" },
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

export default User;