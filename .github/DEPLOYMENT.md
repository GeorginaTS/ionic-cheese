# Deployment Instructions for Ionic Cheese App

This document outlines how to set up and deploy the Ionic Cheese application to Azure Web App using GitHub Actions.

## Prerequisites

1. Azure Web App service already created
2. Firebase project configured
3. GitHub repository with the Ionic Cheese application code

## Setting up GitHub Secrets

Before the GitHub Actions workflow can deploy the application, you need to add the following secrets to your repository:

1. Go to your GitHub repository
2. Navigate to **Settings > Secrets and variables > Actions**
3. Click on **New repository secret**
4. Add the following secrets:

| Secret Name                    | Description                       |
| ------------------------------ | --------------------------------- |
| `FIREBASE_API_KEY`             | Your Firebase API Key             |
| `FIREBASE_AUTH_DOMAIN`         | Your Firebase Auth Domain         |
| `FIREBASE_PROJECT_ID`          | Your Firebase Project ID          |
| `FIREBASE_STORAGE_BUCKET`      | Your Firebase Storage Bucket      |
| `FIREBASE_MESSAGING_SENDER_ID` | Your Firebase Messaging Sender ID |
| `FIREBASE_APP_ID`              | Your Firebase App ID              |
| `FIREBASE_MEASUREMENT_ID`      | Your Firebase Measurement ID      |

> These values can be found in your Firebase project settings or the Firebase console.

The following secrets should already be set up for Azure authentication:

| Secret Name                                                       | Description           |
| ----------------------------------------------------------------- | --------------------- |
| `AZUREAPPSERVICE_CLIENTID_0F9D2722DF2D44B0AB3275506E818DB8`       | Azure Client ID       |
| `AZUREAPPSERVICE_TENANTID_0847DB209E4D438697D0ADACAA3379AA`       | Azure Tenant ID       |
| `AZUREAPPSERVICE_SUBSCRIPTIONID_1D6FC8EE1CA84AB0957F563BC6CE5BC2` | Azure Subscription ID |

## Workflow Explanation

The GitHub Actions workflow does the following:

1. Builds the Ionic application
   - Checks out the code
   - Sets up Node.js
   - Installs dependencies
   - Creates environment files using the GitHub secrets
   - Builds the application for production

2. Deploys to Azure Web App
   - Downloads the build artifact
   - Logs in to Azure
   - Creates a web.config file for SPA routing
   - Deploys the application to Azure Web App

## Manual Deployment

To manually trigger the workflow:

1. Go to the GitHub repository
2. Navigate to **Actions**
3. Select the **Build and deploy Ionic app to Azure Web App** workflow
4. Click on **Run workflow**
5. Select the branch to deploy (default is `autentication`)
6. Click on **Run workflow**

## Troubleshooting

If the deployment fails, check the following:

1. Verify that all GitHub secrets are properly set up
2. Check the workflow logs for any error messages
3. Ensure that the Azure Web App service is properly configured
4. Make sure the Firebase project is correctly set up and the configuration values are correct
