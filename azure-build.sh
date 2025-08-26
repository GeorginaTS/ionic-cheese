#!/bin/bash
# Script para ejecutar en Azure Static Web Apps CI

# Mostrar versión de Node
echo "Node version:"
node --version

# Instalar Ionic CLI globalmente
echo "Installing Ionic CLI..."
npm install -g @ionic/cli

# Generar archivos de entorno
echo "Generating environment files..."
npm run ci:generate:env

# Construir el proyecto
echo "Building project with Ionic..."
ionic build

# Mostrar estructura de directorios para depuración
echo "Folder structure after build:"
ls -la www/

echo "Build completed successfully!"
