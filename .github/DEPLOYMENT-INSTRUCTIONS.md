# Deployment Instructions for Ionic Cheese App

This document explains how to set up the GitHub secrets required for deploying this Ionic application to Azure.

## Setting Up GitHub Secrets

Before the GitHub Actions workflow can deploy the application, you need to add your Firebase configuration as secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings > Secrets and variables > Actions**
3. Click on **New repository secret**
4. Add the following secrets with values from your Firebase project:

| Secret Name | Value from your .env file |
|-------------|---------------------------|
| `FIREBASE_API_KEY` | `AIzaSyB8s4uDCXbfihLyk17fIXPQyq7GEg0q4tI` |
| `FIREBASE_AUTH_DOMAIN` | `cheese-29925.firebaseapp.com` |
| `FIREBASE_PROJECT_ID` | `cheese-29925` |
| `FIREBASE_STORAGE_BUCKET` | `cheese-29925.firebasestorage.app` |
| `FIREBASE_MESSAGING_SENDER_ID` | `667487841882` |
| `FIREBASE_APP_ID` | `1:667487841882:web:e4cafc22a81221aa5cf263` |
| `FIREBASE_MEASUREMENT_ID` | `G-V5G0WLWDPM` |

The following Azure authentication secrets should already be set up:

| Secret Name | Description |
|-------------|-------------|
| `AZUREAPPSERVICE_CLIENTID_0F9D2722DF2D44B0AB3275506E818DB8` | Azure Client ID |
| `AZUREAPPSERVICE_TENANTID_0847DB209E4D438697D0ADACAA3379AA` | Azure Tenant ID |
| `AZUREAPPSERVICE_SUBSCRIPTIONID_1D6FC8EE1CA84AB0957F563BC6CE5BC2` | Azure Subscription ID |

## How the Deployment Works

The workflow does the following:

1. Sets up the Node.js environment and installs dependencies
2. Creates environment files with Firebase configuration directly (bypassing config-env.ts)
3. Builds the Ionic application with production settings
4. Creates a web.config file for proper routing in Azure
5. Deploys the built application to Azure Web App

## Triggering a Deployment

The workflow runs automatically when you push to the `autentication` branch. You can also trigger it manually:

1. Go to your repository on GitHub
2. Navigate to **Actions**
3. Select the **Deploy to Azure** workflow
4. Click **Run workflow**
5. Select the branch and click **Run workflow**

## Troubleshooting

If the deployment fails:

1. Check the GitHub Actions logs for error messages
2. Verify that all secrets are correctly set up
3. Make sure the Azure Web App service exists and is properly configured
4. Check that your Firebase project is correctly configured

> **Security Note**: Never commit your `.env` file or any other file containing sensitive credentials to your repository.
