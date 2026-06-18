# Hosting Report

## Step 2: Prepare Hosting

- **Target Hosting Provider**: Render (Preferred)
- **Configuration Applied**:
  - A `render.yaml` Blueprint file has been generated in the root directory.
  - **Root Directory**: Set to `backend`
  - **Runtime**: Node
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Environment Variables**: Automatically injects `NODE_ENV=production`.
- **Port Verification**: The backend has been refactored to read dynamically assigned ports via `process.env.PORT`.

**Action Required**: The user must link the repository to Render and deploy via the Blueprint.
