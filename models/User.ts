import mongoose from "mongoose";

interface IUser {
	_id: mongoose.Types.ObjectId;
	name: string;
	email: string;
	password: string;
	slug: string;
	avatar: string;
	bio: string;
	theme: string;
	settings: {
		public: boolean;
		language: string;
	};
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
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

const User = mongoose.model<IUser>("User", userSchema);

export default User;