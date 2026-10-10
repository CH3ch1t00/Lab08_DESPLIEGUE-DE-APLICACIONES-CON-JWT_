
// Configuración de base de datos.
// En producción (Render) usa variables de entorno.
// Para despliegues gratuitos puedes usar SQLite: DB_DIALECT=sqlite
export default {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "1234",
  DB: process.env.DB_NAME || "db",
  PORT: process.env.DB_PORT || 3306,
  dialect: process.env.DB_DIALECT || "mysql",
  // Ruta del archivo SQLite (solo si DB_DIALECT=sqlite)
  SQLITE_STORAGE: process.env.SQLITE_STORAGE || "./database.sqlite",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
