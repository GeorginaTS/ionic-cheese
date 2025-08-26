// ci-generate-env.ts
// Este script genera archivos de entorno para entornos CI (como Netlify)
// sin depender de la existencia de un archivo .env
import * as fs from 'fs';
import * as path from 'path';

// Definir las rutas de los archivos
const targetPath = path.join(__dirname, './src/environments/environment.ts');
const targetProdPath = path.join(
  __dirname,
  './src/environments/environment.prod.ts'
);

// Función principal
function generateEnvironmentFiles() {
  try {
    // Obtener variables de entorno del proceso, con valores por defecto si no existen
    const envVars = {
      FIREBASE_API_KEY:
        process.env['FIREBASE_API_KEY'] || 'dummy-key-for-build',
      FIREBASE_AUTH_DOMAIN:
        process.env['FIREBASE_AUTH_DOMAIN'] || 'dummy-domain-for-build',
      FIREBASE_PROJECT_ID:
        process.env['FIREBASE_PROJECT_ID'] || 'dummy-project-for-build',
      FIREBASE_STORAGE_BUCKET:
        process.env['FIREBASE_STORAGE_BUCKET'] || 'dummy-bucket-for-build',
      FIREBASE_MESSAGING_SENDER_ID:
        process.env['FIREBASE_MESSAGING_SENDER_ID'] || '000000000000',
      FIREBASE_APP_ID:
        process.env['FIREBASE_APP_ID'] ||
        '1:000000000000:web:0000000000000000000000',
      FIREBASE_MEASUREMENT_ID:
        process.env['FIREBASE_MEASUREMENT_ID'] || 'G-0000000000',
      API_URL:
        process.env['apiUrl'] || 'https://ionic-cheese-back.onrender.com/api',
    };

    // Generar contenido del archivo de entorno
    const environmentContent = `
// Este archivo fue generado automáticamente por ci-generate-env.ts
export const environment = {
  production: false,
  apiUrl: '${envVars.API_URL}',
  useEmulators: false,
  firebase: {
    apiKey: '${envVars.FIREBASE_API_KEY}',
    authDomain: '${envVars.FIREBASE_AUTH_DOMAIN}',
    projectId: '${envVars.FIREBASE_PROJECT_ID}',
    storageBucket: '${envVars.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${envVars.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${envVars.FIREBASE_APP_ID}',
    measurementId: '${envVars.FIREBASE_MEASUREMENT_ID}'
  }
};
`;

    // Generar contenido del archivo de entorno de producción
    const prodEnvironmentContent = `
// Este archivo fue generado automáticamente por ci-generate-env.ts
export const environment = {
  production: true,
  apiUrl: '${envVars.API_URL}',
  useEmulators: false,
  firebase: {
    apiKey: '${envVars.FIREBASE_API_KEY}',
    authDomain: '${envVars.FIREBASE_AUTH_DOMAIN}',
    projectId: '${envVars.FIREBASE_PROJECT_ID}',
    storageBucket: '${envVars.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${envVars.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${envVars.FIREBASE_APP_ID}',
    measurementId: '${envVars.FIREBASE_MEASUREMENT_ID}'
  }
};
`;

    // Crear directorio si no existe
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Escribir archivos de entorno
    fs.writeFileSync(targetPath, environmentContent);
    console.log(`✅ Archivo de entorno generado: ${targetPath}`);

    fs.writeFileSync(targetProdPath, prodEnvironmentContent);
    console.log(
      `✅ Archivo de entorno de producción generado: ${targetProdPath}`
    );

    // Mostrar valores (ocultando las partes sensibles)
    console.log('Variables de entorno utilizadas:');
    Object.entries(envVars).forEach(([key, value]) => {
      if (typeof value === 'string') {
        // Mostrar solo los primeros 4 caracteres seguidos de asteriscos
        const displayValue =
          value.length > 8
            ? value.substring(0, 4) + '*'.repeat(8)
            : '*'.repeat(8);
        console.log(`${key}: ${displayValue}`);
      } else {
        console.log(`${key}: [valor no mostrado]`);
      }
    });
  } catch (error) {
    console.error('❌ Error generando los archivos de entorno:', error);
    process.exit(1);
  }
}

// Ejecutar la función
generateEnvironmentFiles();
