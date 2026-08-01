import { Router } from "express";
import { createUser, getUserBySlug, listUsers, loginUser, checkUser, getUserById, editUser } from "../controllers/UserController.js";

// middleware
import checkToken from "../utils/verify-token.js";
import { imageUpload } from "../utils/image-upload.js";

const userRoutes = Router();

userRoutes.post("/register", createUser);
userRoutes.get("/", listUsers);
userRoutes.post("/login", loginUser);
userRoutes.get("/checkuser", checkUser);
userRoutes.get("/:id", getUserById);
userRoutes.get("/:slug", getUserBySlug);
userRoutes.patch("/edit/:id", checkToken, imageUpload.single("image"), editUser);


export default userRoutes;
