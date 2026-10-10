# GUÍA DE ENTREGA — Laboratorio 8: Despliegue de aplicaciones con JWT

**Alumno:** Sergio André Ponce Morón — **Grupo:** A — **Docente:** Renato Usnayo Cáceres
**Proyecto desplegado:** LAB07_JWT (laboratorio pasado) — Backend Node.js + Express + JWT (Sequelize/SQLite) y Frontend React.

Estado actual: ✅ código listo para producción, ✅ probado localmente (registro, login, JWT, rutas protegidas), ✅ repo Git con commit inicial.

---

## 1. Subir el proyecto a GitHub

En la terminal (dentro de `C:\Users\sapm3\LAB07_JWT`):

```bash
# 1. En github.com crear repo PUBLIC vacío llamado "lab07-jwt" (sin README)
git remote add github https://github.com/CH3ch1t00/lab07-jwt.git
git branch -M main
git push -u github main
# Al hacer push se abre el navegador para iniciar sesión en GitHub (Git Credential Manager)
```

## 2. Desplegar el BACKEND en Render

1. Entrar a **render.com** → New + → **Web Service** → conectar GitHub → elegir el repo.
2. Configuración:
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. **Environment Variables** (clave = valor):

| Key | Value |
|---|---|
| `DB_DIALECT` | `sqlite` |
| `SQLITE_STORAGE` | `./database.sqlite` |
| `JWT_SECRET` | (una clave larga aleatoria, ej. `s3cr3t0-l4b08-jwt-2026`) |
| `ALLOWED_ORIGINS` | `*` (o la URL del frontend cuando la tengas) |

4. **Deploy**. Copiar la URL que genera (ej. `https://lab07-jwt-backend.onrender.com`).
5. Probar en el navegador: `https://TU-URL.onrender.com/` debe responder:
   `{"message":"Welcome to the Node.js JWT Authentication API."}`

> Nota: los servicios gratuitos de Render "duermen" tras 15 min; la primera petición tarda ~30 s en despertar.

## 3. Desplegar el FRONTEND en Render

1. New + → **Static Site** → mismo repo.
2. Configuración:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
3. **Environment Variable:**

| Key | Value |
|---|---|
| `REACT_APP_API_URL` | `https://TU-URL-BACKEND.onrender.com/api/` |

4. **Deploy** → abrir la URL del frontend → probar login con un usuario registrado.

## 4. Probar el flujo completo (para las capturas)

1. Registrar: POST `.../api/auth/signup` con `{username, email, password}` (Postman o Thunder Client en VS Code).
2. Login: POST `.../api/auth/signin` → devuelve `accessToken` y `refreshToken`.
3. Ruta protegida: GET `.../api/test/user` con header `x-access-token: <accessToken>` → "User Content."
4. Sin token → error 403 "No se proporcionó un token!".
5. Frontend: iniciar sesión → "¡Inicio de sesión exitoso!" + Panel de Usuario Protegido.

## 5. Checklist de capturas (para el reporte)

- [ ] Estructura del proyecto en VS Code (backend + frontend)
- [ ] `server.js` (CORS dinámico, PORT, seed de roles)
- [ ] `db.config.js` y `models/index.js` (SQLite por entorno)
- [ ] `authJwt.js` (verificación del JWT)
- [ ] Terminal: `Server is running on port 8080` + `Roles disponibles: user, admin, moderator`
- [ ] Ejecución local: registro, login con token, ruta protegida OK y 403 sin token
- [ ] Repositorio en GitHub con los archivos subidos
- [ ] Dashboard de Render: Web Service (backend) ✅ Active
- [ ] Dashboard de Render: Static Site (frontend) ✅ Active
- [ ] URL pública del backend respondiendo en el navegador
- [ ] Frontend desplegado funcionando (login + panel protegido)

## 6. Guion del video (máx. 4 minutos)

1. **0:00–0:30** Presentación: qué es el proyecto (autenticación JWT), estructura backend/frontend.
2. **0:30–1:30** Recorrido del código: `server.js` (CORS y PORT), `authJwt.js` (middleware que valida el token), `api.js` (interceptor que agrega el token a cada petición), config por variables de entorno.
3. **1:30–2:30** Ejecución local: registro → login → token → ruta protegida (y el 403 sin token).
4. **2:30–3:30** Despliegue: repo en GitHub, servicios en Render (backend Web Service + frontend Static Site), variables de entorno.
5. **3:30–4:00** URLs públicas funcionando y conclusión.

## 7. Observaciones (para el reporte)

- El proyecto original usaba MySQL en `localhost` con credenciales fijas; para el despliegue se migró la configuración a variables de entorno y se agregó soporte SQLite (gratuito en Render).
- Se agregó `seedRoles()` porque en una BD nueva el registro de usuarios fallaba al no existir el rol "user".
- El CORS se hizo dinámico (`ALLOWED_ORIGINS`) porque en producción el frontend ya no corre en localhost.
- Render reinicia el sistema de archivos en cada despliegue: los usuarios registrados se pierven al redesplegar (aceptable para el lab; en producción real se usaría una BD externa como PostgreSQL).

## 8. Conclusiones (para el reporte)

- Desplegar una app JWT requiere separar configuración del código (dotenv), abrir CORS al origen real y externalizar el secreto JWT.
- El token se envía por header `x-access-token` y el backend lo valida con `jsonwebtoken`; sin él, las rutas protegidas responden 403.
- Git fue esencial: `node_modules` nunca se sube, solo `package.json`/`package-lock.json`, y Render instala las dependencias en la nube.
