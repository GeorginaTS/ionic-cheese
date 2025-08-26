@echo off
REM Script para ejecutar en Azure Static Web Apps CI en Windows

echo Node version:
node --version

echo Installing Ionic CLI...
call npm install -g @ionic/cli

echo Generating environment files...
call npm run ci:generate:env

echo Building project with Ionic...
call ionic build

echo Folder structure after build:
dir www

echo Build completed successfully!
