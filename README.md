
## Build for production

1. Install dependencies (if not done):
   `npm install`
2. Build the static assets:
   `npm run build`
3. Preview the production build locally:
   `npm run preview`

## Deploy (Vercel)

This project is configured for Vercel (see `vercel.json`). By default the production branch is `main`.

Recommended deploy workflow:

- Push your changes to `main` and let Vercel build automatically.
- If Vercel does not pick up your latest commit or you need to force a new build, you can trigger a redeploy without code changes by creating an empty commit and pushing it:

```powershell
cd "C:\temp\project farmboy\agriassist-pro"
git commit --allow-empty -m "chore: trigger Vercel redeploy"
git push origin main
```

- Alternatively, use the Vercel CLI to deploy directly (requires `vercel` and login):

```powershell
# install once if needed
npm i -g vercel

# deploy current directory to production
vercel --prod --confirm
```

## Verify deployment

- Check the Vercel dashboard (Project → Deployments) and confirm the latest deployment commit SHA matches the `git rev-parse origin/main` output.
- Inspect the deployment build logs if the site still shows old content.
- Hard-refresh the site (Ctrl+F5) or check in an Incognito window to avoid browser cache.

## DNS / Custom domain checks

- If you use a custom domain, confirm it points to the correct Vercel project in the Vercel dashboard and that DNS records (CNAME / A) match Vercel's instructions.

## Quick troubleshooting

- Ensure the Vercel project is connected to the `vigneshworkspace/agri` repo and the Production Branch is `main`.
- If builds fail on Vercel, open the failed deployment and review the build logs for errors.

## Changelog (recent)

- chore(ui): mobile nav & responsive header — updated `App.tsx` (responsive mobile toolbar and header).
- chore: trigger Vercel redeploy — empty commit to force Vercel to rebuild when needed.
