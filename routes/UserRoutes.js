import { Router } from "express";
import { createUser, getUserBySlug, listUsers, loginUser, checkUser, getUserById, editUser } from "../controllers/UserController.js";
import checkToken from "../utils/verify-token.js";

const userRoutes = Router();

userRoutes.post("/register", createUser);
userRoutes.get("/", listUsers);
userRoutes.post("/login", loginUser);
userRoutes.get("/checkuser", checkUser);
userRoutes.get("/:id", getUserById);
userRoutes.get("/:slug", getUserBySlug);
userRoutes.patch("/edit/:id", checkToken, editUser);


export default userRoutes;
