// config-env.ts
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Carrega les variables d'entorn del fitxer .env
dotenv.config();

// Defineix les rutes dels fitxers
const templatePath = path.join(__dirname, './src/environments/environment.template.ts');
const targetPath = path.join(__dirname, './src/environments/environment.ts');
const targetProdPath = path.join(__dirname, './src/environments/environment.prod.ts');

// Interfície per validar les variables d'entorn
interface EnvironmentVars {
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  FIREBASE_MEASUREMENT_ID: string;
}

// Funció per comprovar si totes les variables requerides existeixen
function validateEnvironmentVars(): EnvironmentVars {
  const requiredVars: (keyof EnvironmentVars)[] = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID',
    'FIREBASE_MEASUREMENT_ID'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Falten les següents variables d'entorn: ${missingVars.join(', ')}`);
  }
  
  return {
    FIREBASE_API_KEY: process.env['FIREBASE_API_KEY']!,
    FIREBASE_AUTH_DOMAIN: process.env['FIREBASE_AUTH_DOMAIN']!,
    FIREBASE_PROJECT_ID: process.env['FIREBASE_PROJECT_ID']!,
    FIREBASE_STORAGE_BUCKET: process.env['FIREBASE_STORAGE_BUCKET']!,
    FIREBASE_MESSAGING_SENDER_ID: process.env['FIREBASE_MESSAGING_SENDER_ID']!,
    FIREBASE_APP_ID: process.env['FIREBASE_APP_ID']!,
    FIREBASE_MEASUREMENT_ID: process.env['FIREBASE_MEASUREMENT_ID']!
  };
}

// Funció principal
function generateEnvironmentFiles() {
  try {
    // Valida les variables d'entorn
    const envVars = validateEnvironmentVars();
    
    // Llegeix la plantilla
    let templateContent = fs.readFileSync(templatePath, 'utf8');
    
    // Substitueix els placeholders amb els valors reals
    Object.entries(envVars).forEach(([key, value]) => {
      const placeholder = `%${key}%`;
      templateContent = templateContent.replace(new RegExp(placeholder, 'g'), value);
    });
    
    // Escriu el fitxer d'entorn de desenvolupament
    fs.writeFileSync(targetPath, templateContent);
    console.log(`✅ Generat fitxer d'entorn: ${targetPath}`);
    
    // Escriu el fitxer d'entorn de producció
    const prodContent = templateContent.replace('production: false', 'production: true');
    fs.writeFileSync(targetProdPath, prodContent);
    console.log(`✅ Generat fitxer d'entorn de producció: ${targetProdPath}`);
  } catch (error) {
    console.error('❌ Error generant els fitxers d\'entorn:', error);
    process.exit(1);
  }
}

// Executa la funció
generateEnvironmentFiles();