# Railway Deployment Guide - Frontend

## Pasos para desplegar el frontend en Railway:

### 1. Preparar el repositorio
```bash
cd frontend
git init
git add .
git commit -m "Initial frontend commit for Railway"
```

### 2. Crear proyecto en Railway
1. Ve a [railway.app](https://railway.app)
2. Crea un nuevo proyecto
3. Selecciona "Deploy from GitHub repo"
4. Selecciona el repositorio del frontend

### 3. Configurar variables de entorno
En Railway, agrega la variable:
- `VITE_API_URL=https://tu-backend-url.railway.app/api`

**Importante:** Reemplaza `tu-backend-url.railway.app` con la URL real de tu backend desplegado.

### 4. Deploy automático
Railway detectará automáticamente:
- ✅ Aplicación React/Vite
- ✅ Comando de build: `npm run build`
- ✅ Comando de start: `npm run preview`
- ✅ Puerto dinámico desde `$PORT`

### 5. Verificar deployment
- La aplicación se construirá automáticamente
- Se servirá en el puerto asignado por Railway
- Verifica que la conexión a la API funcione

## Configuración incluida:

### Railway.toml
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run preview"
healthcheckPath = "/"

[variables]
NODE_ENV = "production"
```

### Package.json
- Script `preview` configurado para Railway
- Puerto dinámico: `--port $PORT`
- Host configurado: `--host 0.0.0.0`

### Vite.config.ts
- Puerto de preview dinámico
- Host configurado para Railway
- Build optimizado para producción

## Conexión Backend-Frontend:

1. **Backend**: Desplegado en Railway con su propia URL
2. **Frontend**: Usa `VITE_API_URL` para conectarse al backend
3. **CORS**: El backend ya está configurado con CORS para permitir conexiones

## Verificación final:

1. ✅ Frontend desplegado y accesible
2. ✅ API_URL configurada correctamente
3. ✅ Conexión exitosa entre frontend y backend
4. ✅ Todas las funciones CRUD funcionando

## URLs finales:
- **Frontend**: `https://tu-frontend.railway.app`
- **Backend**: `https://tu-backend.railway.app/api`
