import { Router } from "express";
import { createUser, getUserBySlug, listUsers } from "../controllers/UserController.js";

const userRoutes = Router();

userRoutes.post("/register", createUser);
userRoutes.get("/", listUsers);
userRoutes.get("/:slug", getUserBySlug);

export default userRoutes;
