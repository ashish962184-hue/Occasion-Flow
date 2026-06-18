# Frontend Integration Report

## Step 6: Connect Frontend

**[MANUAL ACTION REQUIRED]**

Because the automated deployment CLI tokens are not active, you must manually update Vercel to point to your new Render backend:
1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Select the `alexandria-crm` project.
3. Navigate to **Settings** -> **Environment Variables**.
4. Locate the `VITE_API_URL` variable.
5. **Update the Value**: Change the value from the old localtunnel URL to your newly generated Render URL (e.g., `https://alexandria-crm-api.onrender.com`).
6. Click **Save**.
7. Navigate to the **Deployments** tab and click **Redeploy** on your latest production branch.

**Status**: Waiting for manual variable injection and redeployment.
