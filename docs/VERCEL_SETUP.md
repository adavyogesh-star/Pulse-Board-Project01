Vercel setup for this repository

Overview
This document explains two ways to connect and deploy the frontend on Vercel:

1) Recommended (UI connect + automatic previews)
   - Connect your GitHub repository to Vercel via the Vercel dashboard. Vercel will automatically create preview deployments for pull requests and production deployments for pushes to main.

2) GitHub Actions deploy (CI-driven)
   - Use the included GitHub Actions workflow (.github/workflows/deploy-vercel.yml) which deploys preview builds on PRs and production on push to main using the amondnet/vercel-action.

Required GitHub secrets (for the Actions deploy)
- VERCEL_TOKEN: Personal token from Vercel (stored as GitHub Secret)
- VERCEL_ORG_ID: Organization ID for the Vercel account
- VERCEL_PROJECT_ID: Project ID for this Vercel project
- VERCEL_SCOPE: Your Vercel username or team slug (used by the action)

How to get the values
1. Go to https://vercel.com and log in.
2. Create a new project and import this GitHub repo or create a project first and link the repo.
3. In the project settings, find the "General" or "Git" section to see the Project ID and Org ID.
4. Create a Personal Token in Vercel (Account Settings → Tokens) and copy it.
5. In your GitHub repo, go to Settings → Secrets and variables → Actions → New repository secret. Add the four secrets above with the values from Vercel.

After secrets are set
- For PRs: create a pull request and the deploy-preview job will run and deploy to Vercel. The action logs include the preview URL returned by Vercel.
- For production: push a commit to main; deploy-prod will run and publish to production.

Notes
- Vercel will also display preview deployments automatically when connected via the Vercel UI; using that integration is simpler and recommended.
- The provided vercel.json points Vercel to the frontend package and specifies the dist directory for static builds (Vite). Adjust if you have a custom build output.
- Do not commit secrets to the repo. Use GitHub Secrets.
