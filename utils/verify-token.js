import jwt from "jsonwebtoken";
import getToken from "../utils/get-token.js";

const checkToken = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Acesso negado! Token não fornecido." });
    }

    const token = getToken(req);
    
    if (!token) {
        return res.status(401).json({ message: "Acesso negado! Token não fornecido." });
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }

};

export default checkToken;