"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// config-env.ts
var fs = require("fs");
var path = require("path");
var dotenv = require("dotenv");
// Carrega les variables d'entorn del fitxer .env
dotenv.config();
// Defineix les rutes dels fitxers
var templatePath = path.join(__dirname, './src/environments/environment.template.ts');
var targetPath = path.join(__dirname, './src/environments/environment.ts');
var targetProdPath = path.join(__dirname, './src/environments/environment.prod.ts');
// Funció per comprovar si totes les variables requerides existeixen
function validateEnvironmentVars() {
    var requiredVars = [
        'FIREBASE_API_KEY',
        'FIREBASE_AUTH_DOMAIN',
        'FIREBASE_PROJECT_ID',
        'FIREBASE_STORAGE_BUCKET',
        'FIREBASE_MESSAGING_SENDER_ID',
        'FIREBASE_APP_ID',
        'FIREBASE_MEASUREMENT_ID'
    ];
    var missingVars = requiredVars.filter(function (varName) { return !process.env[varName]; });
    if (missingVars.length > 0) {
        throw new Error("Falten les seg\u00FCents variables d'entorn: ".concat(missingVars.join(', ')));
    }
    return {
        FIREBASE_API_KEY: process.env['FIREBASE_API_KEY'],
        FIREBASE_AUTH_DOMAIN: process.env['FIREBASE_AUTH_DOMAIN'],
        FIREBASE_PROJECT_ID: process.env['FIREBASE_PROJECT_ID'],
        FIREBASE_STORAGE_BUCKET: process.env['FIREBASE_STORAGE_BUCKET'],
        FIREBASE_MESSAGING_SENDER_ID: process.env['FIREBASE_MESSAGING_SENDER_ID'],
        FIREBASE_APP_ID: process.env['FIREBASE_APP_ID'],
        FIREBASE_MEASUREMENT_ID: process.env['FIREBASE_MEASUREMENT_ID']
    };
}
// Funció principal
function generateEnvironmentFiles() {
    try {
        // Valida les variables d'entorn
        var envVars = validateEnvironmentVars();
        // Llegeix la plantilla
        var templateContent_1 = fs.readFileSync(templatePath, 'utf8');
        // Substitueix els placeholders amb els valors reals
        Object.entries(envVars).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            var placeholder = "%".concat(key, "%");
            templateContent_1 = templateContent_1.replace(new RegExp(placeholder, 'g'), value);
        });
        // Escriu el fitxer d'entorn de desenvolupament
        fs.writeFileSync(targetPath, templateContent_1);
        console.log("\u2705 Generat fitxer d'entorn: ".concat(targetPath));
        // Escriu el fitxer d'entorn de producció
        var prodContent = templateContent_1.replace('production: false', 'production: true');
        fs.writeFileSync(targetProdPath, prodContent);
        console.log("\u2705 Generat fitxer d'entorn de producci\u00F3: ".concat(targetProdPath));
    }
    catch (error) {
        console.error('❌ Error generant els fitxers d\'entorn:', error);
        process.exit(1);
    }
}
// Executa la funció
generateEnvironmentFiles();
