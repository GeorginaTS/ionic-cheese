# Ionic Cheese Application

## Descripción
Aplicación Ionic para administrar y compartir información sobre quesos.

## Configuración del Entorno

### Variables de Entorno
Este proyecto utiliza variables de entorno para la configuración de Firebase y la API URL. Puedes configurar estas variables de las siguientes maneras:

#### Desarrollo Local
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

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

#### Entornos CI/CD
- **GitHub Actions**: Las variables se configuran en los secretos del repositorio.
- **Netlify**: Las variables se configuran en el panel de Netlify en Settings > Build & Deploy > Environment.

## Scripts disponibles

```bash
# Generar archivos de entorno a partir de .env (desarrollo local)
npm run generate:env

# Generar archivos de entorno para CI (sin depender de .env)
npm run ci:generate:env

# Iniciar servidor de desarrollo
npm start

# Construir para producción (local)
npm run build

# Construir para CI/CD (GitHub Actions)
npm run build:ci

# Construir para Netlify
npm run build:netlify
```

## Despliegue

### GitHub Actions (Azure)
El despliegue a Azure se realiza automáticamente mediante GitHub Actions cuando se hace push a la rama `main`. El workflow está configurado en `.github/workflows/azure-deploy.yml`.

### Netlify
El despliegue a Netlify está configurado en el archivo `netlify.toml`. Asegúrate de configurar las variables de entorno necesarias en el panel de Netlify.

## Tecnologías utilizadas
- Ionic Framework
- Angular
- Firebase
- Leaflet (para mapas)
- Tailwind CSS
