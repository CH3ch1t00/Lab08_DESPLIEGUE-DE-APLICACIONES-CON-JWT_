import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./app/models/index.js";
import authRoutes from "./app/routes/auth.routes.js";
import userRoutes from "./app/routes/user.routes.js";

const app = express();

// CORS: permite los orígenes definidos en ALLOWED_ORIGINS (ej. la URL del frontend en Render)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000", "http://localhost:3001"];

const corsOptions = { origin: allowedOrigins };
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Node.js JWT Authentication API." });
});

app.use("/api/auth", authRoutes);
app.use("/api/test", userRoutes);

// Render asigna el puerto con la variable de entorno PORT
const PORT = process.env.PORT || 8080;

db.sequelize.sync({ force: false }).then(async () => {
  await db.seedRoles();
  console.log("Database synchronized");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
});
