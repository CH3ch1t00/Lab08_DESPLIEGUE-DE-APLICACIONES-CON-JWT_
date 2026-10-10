export default {
  // Clave secreta del JWT: en producción definir en variables de entorno
  secret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiration: 60, // Expiración del access token (en segundos, para pruebas: 1 min)
  jwtRefreshExpiration: 86400, // Expiración del refresh token (24 horas en segundos)
};
