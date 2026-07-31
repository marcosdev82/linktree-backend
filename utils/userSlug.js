import User from "../models/User.js";

export function normalizeSlug(name) {
	return name
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "");
}

export async function createUniqueSlug(base) {
	let slug = base;
	let counter = 1;

	while (await User.exists({ slug })) {
		counter += 1;
		slug = `${base}-${counter}`;
	}

	return slug;
}