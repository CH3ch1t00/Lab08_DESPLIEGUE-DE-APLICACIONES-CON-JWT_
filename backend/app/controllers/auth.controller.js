import db from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import authConfig from "../config/auth.config.js";

const { user: User, role: Role, refreshToken: RefreshToken } = db;

export const signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    if (req.body.roles) {
      const roles = await Role.findAll({ where: { name: req.body.roles } });
      await user.setRoles(roles);
    } else {
      const userRole = await Role.findOne({ where: { name: "user" } });
      await user.setRoles([userRole]);
    }

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.body.username },
      include: [{ model: Role, as: "roles" }]
    });

    if (!user) return res.status(404).json({ message: "User Not found." });

    const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ accessToken: null, message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.jwtExpiration,
    });

    let refreshToken = await RefreshToken.createToken(user);
    let authorities = user.roles.map(role => `ROLE_${role.name.toUpperCase()}`);

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token is not in database!" });
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });
      return res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

export const signout = async (req, res) => {
  try {
    const { userId } = req.body;
    await RefreshToken.destroy({ where: { userId: userId } });
    res.status(200).json({ message: "You've been signed out successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};