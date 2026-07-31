import { Router } from "express";
import { createUser, getUserBySlug, listUsers, loginUser, checkUser } from "../controllers/UserController.js";

const userRoutes = Router();

userRoutes.post("/register", createUser);
userRoutes.get("/", listUsers);
userRoutes.post("/login", loginUser);
userRoutes.get("/checkuser", checkUser);
userRoutes.get("/:slug", getUserBySlug);

export default userRoutes;
