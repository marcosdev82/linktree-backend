import "dotenv/config";
import express from "express";
import cors from "cors";
import UserRoutes from "../routes/UserRoutes.js";
import connectDB from "../config/conn.js";

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.static("public"));

app.use("/api/users", UserRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API funcionando!" });
});

app.listen(PORT, () => {
  console.log(`🚀 O Servidor está rodando na porta ${PORT}`);
});