import jwt from "jsonwebtoken";
import db from "../models/index.js";
import authConfig from "../config/auth.config.js";

const { user: User } = db;

export const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "¡No se proporcionó un token!" });
  }

  // Asegurar que sea una cadena limpia sin espacios extras ni saltos de línea
  token = String(token).trim();

  // Si viene con el prefijo "Bearer ", se remueve de forma segura
  if (token.startsWith("Bearer ") || token.startsWith("bearer ")) {
    token = token.slice(7).trim();
  }

  try {
    const decoded = jwt.verify(token, authConfig.secret);
    req.userId = decoded.id;

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(401).json({ message: "¡No autorizado!" });
    }

    next();
  } catch (err) {
    console.error("Error al verificar el JWT:", err.message); // Imprime el error exacto en la terminal para depuración
    return res.status(401).json({ message: "¡No autorizado o token expirado!" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    if (roles.some((role) => role.name === "admin")) {
      next();
      return;
    }

    res.status(403).json({ message: "¡Se requiere el rol de administrador!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const isModerator = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    if (roles.some((role) => role.name === "moderator")) {
      next();
      return;
    }

    res.status(403).json({ message: "¡Se requiere el rol de moderador!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};