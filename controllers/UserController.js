import bcrypt from "bcrypt";
import User from "../models/User.js";

function normalizeSlug(name) {
	return name
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "");
}

async function createUniqueSlug(base) {
	let slug = base;
	let counter = 1;

	while (await User.exists({ slug })) {
		counter += 1;
		slug = `${base}-${counter}`;
	}

	return slug;
}

export async function createUser(req, res) {
	
	try {
		const { name, email, password, bio, theme, avatar } = req.body;

		if (!name || !email || !password) {
			res.status(400).json({ message: "name, email e password são obrigatórios" });
			return;
		}

		const existingUser = await User.exists({ email: email.toLowerCase() });
		if (existingUser) {
			res.status(409).json({ message: "E-mail já cadastrado" });
			return;
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const baseSlug = normalizeSlug(name) || "usuario";
		const slug = await createUniqueSlug(baseSlug);

		const user = await User.create({
			name,
			email,
			password: passwordHash,
			slug,
			bio: bio ?? "",
			theme: theme ?? "default",
			avatar: avatar ?? "",
		});

		const responseUser = {
			_id: user._id,
			name: user.name,
			email: user.email,
			slug: user.slug,
			avatar: user.avatar,
			bio: user.bio,
			theme: user.theme,
			settings: user.settings,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};

		res.status(201).json(responseUser);
	} catch (error) {
		res.status(500).json({ message: "Erro ao criar usuário", error });
	}
}

export async function listUsers(_req, res) {
	try {
		const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: "Erro ao listar usuários", error });
	}
}

export async function getUserBySlug(req, res) {
	try {
		const { slug } = req.params;
		const user = await User.findOne({ slug }, { password: 0 });

		if (!user) {
			res.status(404).json({ message: "Usuário não encontrado" });
			return;
		}

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: "Erro ao buscar usuário", error });
	}
}
