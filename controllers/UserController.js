import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// utils
import createUserToken from "../utils/create-user-token.js";
import getToken from "../utils/get-token.js";
import { ensureEmailIsAvailable } from "../utils/userEmail.js";
import { createUniqueSlug, normalizeSlug } from "../utils/userSlug.js";

export async function createUser(req, res) {
	
	try {
		const { name, email, password, confirmPassword, bio, theme, avatar } = req.body ?? {};

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

		const normalizedEmail = await ensureEmailIsAvailable(email, res);
		if (!normalizedEmail) return;
        
		const saltRounds = 12;	
		const passwordHash = await bcrypt.hash(password, saltRounds);
		const baseSlug = normalizeSlug(name) || "usuario";
		const slug = await createUniqueSlug(baseSlug);

		const user = new User({
			name,
			email: normalizedEmail,
			password: passwordHash,
			slug,
			bio: bio ?? "",
			theme: theme ?? "default",
			avatar: avatar ?? "",
		});

		await user.save();

		return createUserToken(user, res);
		
	} catch (error) {
		res.status(500).json({
			message: "Erro ao criar usuário",
			error: error.message,
		});
	}
}

export async function editUser(req, res) {
	try {
		const { id } = req.params;
		const { name, email, password, confirmPassword, bio, theme, avatar } = req.body ?? {};

		const user = await User.findById(id);

		if (req.file) {
			image = req.file.filename
		}

		if (!user) {
			res.status(404).json({ message: "Usuário não encontrado" });
			return;
		}

		if (email) {
			const normalizedEmail = email.trim().toLowerCase();
			const existingUser = await User.findOne({
				email: normalizedEmail,
				_id: { $ne: id },
			});

			if (existingUser) {
				res.status(422).json({ message: "E-mail já cadastrado" });
				return;
			}

			user.email = normalizedEmail;
		}

		if (name) {
			user.name = name;

			const baseSlug = normalizeSlug(name) || "usuario";
			let slug = baseSlug;
			let counter = 1;

			while (await User.exists({ slug, _id: { $ne: id } })) {
				counter += 1;
				slug = `${baseSlug}-${counter}`;
			}

			user.slug = slug;
		}

		if (password) {
			if (!confirmPassword) {
				res.status(422).json({ message: "Confirmação de senha é obrigatória" });
				return;
			}

			if (password !== confirmPassword) {
				res.status(422).json({ message: "As senhas não coincidem" });
				return;
			}

			const saltRounds = 12;
			user.password = await bcrypt.hash(password, saltRounds);
		}

		if (bio !== undefined) user.bio = bio;
		if (theme !== undefined) user.theme = theme;
		if (avatar !== undefined) user.avatar = avatar;

		await user.save();

		res.status(200).json({
			message: "Usuário atualizado com sucesso",
			user: {
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
			},
		});
	} catch (error) {
		res.status(500).json({
			message: "Erro ao editar usuário",
			error: error.message,
		});
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

export async function getUserById(req, res) {

	const { id } = req.params;
	 
	try {
		const user = await User.findById(id, { password: 0 }).select("-password");

		if (!user) {
			res.status(404).json({ message: "Usuário não encontrado" });
			return;
		}

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: "Erro ao buscar usuário", error: error.message });
	}
}

export async function loginUser(req, res) {
	try {
		const { email, password } = req.body ?? {};

		if (!email) {
			res.status(422).json({ message: "E-mail é obrigatório" });
			return;
		}

		if (!password) {
			res.status(422).json({ message: "Senha é obrigatória" });
			return;
		}

		const normalizedEmail = email.trim().toLowerCase();
		const user = await User.findOne({ email: normalizedEmail });

		if (!user) {
			res.status(422).json({ message: "Usuário não encontrado" });
			return;
		}

		const checkPassword = await bcrypt.compare(password, user.password);
		if (!checkPassword) {
			res.status(422).json({ message: "Senha inválida" });
			return;
		}

		return createUserToken(user, res);

	} catch (error) {
		res.status(500).json({
			message: "Erro ao realizar login",
			error: error.message,
		});
	}
}

export async function checkUser(req, res) {
	let currentUser;

	if (req.headers.authorization) {

		const token = getToken(req);
		if (!token) {
			res.status(401).json({ message: "Token não fornecido" });
			return;
		}

		try {
			const decoded = jwt.verify(token, process.env.SECRET);
			currentUser = await User.findById(decoded.id, { password: 0 });
			currentUser.password = undefined; // Remove a senha do objeto do usuário antes de enviá-lo na resposta
		} catch (error) {
			res.status(401).json({ message: "Token inválido" });
			return;
		}
		 
	} else {
		currentUser = null;
	}

	res.status(200).json(currentUser);
}