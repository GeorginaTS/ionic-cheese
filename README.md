# Ionic Cheese App

Una aplicación Ionic/Angular para gestionar y compartir información sobre quesos.

## Entornos de Despliegue

La aplicación puede ser desplegada en tres entornos diferentes:

1. **Azure Web App** - Usando el flujo de trabajo en `.github/workflows/azure-deploy.yml`
2. **Azure Static Web Apps** - Usando el flujo de trabajo en `.github/workflows/azure-static-web-apps.yml`
3. **Netlify** - Configurado con `netlify.toml`

## Configuración de Entorno

Para el desarrollo local, crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
apiUrl=https://ionic-cheese-back.onrender.com/api
```

## Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run build:ci` - Construye la aplicación para CI/CD (GitHub Actions)
- `npm run build:netlify` - Construye la aplicación para Netlify
- `npm run build:azure` - Construye la aplicación para Azure Static Web Apps

## Configuración de CI/CD

### Azure Static Web Apps
- Archivo de configuración: `staticwebapp.config.json`
- Workflow: `.github/workflows/azure-static-web-apps.yml`

### Netlify
- Archivo de configuración: `netlify.toml`

