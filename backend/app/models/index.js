import Sequelize from "sequelize";
import dbConfig from "../config/db.config.js";
import userModel from "./user.model.js";
import roleModel from "./role.model.js";
import refreshTokenModel from "./refreshToken.model.js";

let sequelize;

// SQLite (ideal para despliegues gratuitos como Render) o MySQL/Postgres
// En Render usamos better-sqlite3 (binarios precompilados, sin build nativo)
// Dialecto = "sqlite", pero usamos better-sqlite3 como driver via dialectModule
// better-sqlite3 exporta la clase Database directamente; Sequelize espera lib.Database
if (dbConfig.dialect === "sqlite") {
  const BetterSqlite3 = (await import("better-sqlite3")).default;
  const dialectModule = { Database: BetterSqlite3 };
  sequelize = new Sequelize({
    dialect: "sqlite",
    dialectModule,
    storage: dbConfig.SQLITE_STORAGE,
  });
} else {
  sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    port: dbConfig.PORT
  });
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = userModel(sequelize, Sequelize);
db.role = roleModel(sequelize, Sequelize);
db.refreshToken = refreshTokenModel(sequelize, Sequelize);

// Relaciones User - Role
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
  as: "roles"
});

// Relación User - RefreshToken
db.refreshToken.belongsTo(db.user, {
  foreignKey: 'userId',
  targetKey: 'id',
});
db.user.hasOne(db.refreshToken, {
  foreignKey: 'userId',
  targetKey: 'id',
});

db.ROLES = ["user", "admin", "moderator"];

// Semilla: crea los roles por defecto si la BD está vacía (ej. SQLite en Render)
db.seedRoles = async () => {
  for (const roleName of db.ROLES) {
    await db.role.findOrCreate({ where: { name: roleName } });
  }
  console.log("Roles disponibles:", db.ROLES.join(", "));
};

export default db;