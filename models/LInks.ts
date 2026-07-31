import mongoose from "mongoose";

interface ILink {
	_id: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
	title: string;
	url: string;
	icon: string;
	order: number;
	active: boolean;
	clicks: number;
	createdAt: Date;
	updatedAt: Date;
}

const linkSchema = new mongoose.Schema<ILink>(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
		title: { type: String, required: true, trim: true },
		url: { type: String, required: true, trim: true },
		icon: { type: String, default: "" },
		order: { type: Number, default: 0 },
		active: { type: Boolean, default: true },
		clicks: { type: Number, default: 0 },
	},
	{
		timestamps: true,
	}
);

linkSchema.index({ userId: 1, order: 1 });

const Link = mongoose.model<ILink>("Link", linkSchema);

export default Link;
