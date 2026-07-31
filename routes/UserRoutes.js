import { Router } from "express";
import { createUser, getUserBySlug, listUsers, loginUser, checkUser, getUserById } from "../controllers/UserController.js";

const userRoutes = Router();

userRoutes.post("/register", createUser);
userRoutes.get("/", listUsers);
userRoutes.post("/login", loginUser);
userRoutes.get("/checkuser", checkUser);
userRoutes.get("/:id", getUserById);
userRoutes.get("/:slug", getUserBySlug);


export default userRoutes;
