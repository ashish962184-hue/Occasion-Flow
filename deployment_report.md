# Deployment Report

## Step 4: Deploy Backend

**[MANUAL ACTION REQUIRED]**

Because the automated deployment CLI tokens are not active, you must manually trigger the deployment to Render:
1. Commit the `render.yaml` and `server.js` modifications to your repository and push to GitHub.
2. Log into the [Render Dashboard](https://dashboard.render.com).
3. Click **New** -> **Blueprint**.
4. Connect the GitHub repository containing the CRM.
5. Render will automatically detect the `render.yaml` file and begin deployment.

**Expected Verification**: Once deployed, Render will generate a URL structurally similar to `https://alexandria-crm-api.onrender.com`. Keep this URL handy for Step 6.
