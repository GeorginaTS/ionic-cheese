#!/bin/bash

# Este script se ejecuta en el entorno de construcción de Netlify

echo "Instalando dependencias adicionales para Netlify..."
npm install -g @ionic/cli

echo "Verificando instalación de Ionic CLI..."
ionic --version

echo "Instalación completada exitosamente."
