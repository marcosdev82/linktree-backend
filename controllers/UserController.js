import bcrypt from "bcrypt";
import User from "../models/User.js";
import createUserToken from "../utils/create-user-token.js";
import { createUniqueSlug, normalizeSlug } from "../utils/userSlug.js";

export async function createUser(req, res) {
	
	try {
		const { name, email, password, confirmPassword, bio, theme, avatar } = req.body;

		if (!name) {
			res.status(422).json({ message: "Nome é obrigatório" });
			return;
		}

		if (!email) {
			res.status(422).json({ message: "E-mail é obrigatório" });
			return;
		}

		if (!password) {
			res.status(422).json({ message: "Senha é obrigatória" });
			return;
		}

		if (!confirmPassword) {
			res.status(422).json({ message: "Confirmação de senha é obrigatória" });
			return;
		}

		if (password !== confirmPassword) {
			res.status(422).json({ message: "As senhas não coincidem" });
			return;
		}

		const existingUser = await User.exists({ email: email.toLowerCase() });

		if (existingUser) {
			res.status(422).json({ message: "E-mail já cadastrado" });
			return;
		}
        
		const saltRounds = 12;	
		const passwordHash = await bcrypt.hash(password, saltRounds);
		const baseSlug = normalizeSlug(name) || "usuario";
		const slug = await createUniqueSlug(baseSlug);

		const user = new User({
			name,
			email,
			password: passwordHash,
			slug,
			bio: bio ?? "",
			theme: theme ?? "default",
			avatar: avatar ?? "",
		});

		await user.save();

		return createUserToken(user, res);
		
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
