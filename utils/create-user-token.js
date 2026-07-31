import jwt from "jsonwebtoken";

export default function createUserToken(user, res) {
	if (!process.env.SECRET) {
		throw new Error("Variável SECRET não definida no ambiente");
	}

    const token = jwt.sign(
        {
            id: user._id,
            name: user.name,
        },
        process.env.SECRET,
        { expiresIn: "7d" }
    );

    return res.status(201).json({
        message: "Usuário criado e autenticado com sucesso",
        token,
        userId: user._id,
    });
}