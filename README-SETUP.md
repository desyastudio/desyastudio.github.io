# Desya Design Studio — Real Admin Panel Setup

This replaces the old version. What changed structurally:

- The old admin panel only saved changes to YOUR browser (localStorage).
  Nobody else — not other visitors, not you on your phone — ever saw
  those edits. That's now fixed: changes save to the server and show
  up for everyone immediately.
- The gear-icon admin button is gone from the public site entirely.
  The editor now lives at a separate, unlinked page: yoursite.com/admin
  It's not in any menu and nothing on the public site points to it.
- That admin page is locked behind a password only you set (see step 3
  below). I never see or store that password — you create it directly
  in Vercel, and the website checks against it on the server.

This is no longer a single HTML file — it needs 6 files together
(index.html, admin.html, package.json, and 3 files inside an `api`
folder) plus one storage add-on inside your Vercel project. Follow
every step in order; skipping the storage or password step means the
admin page won't work yet (it'll tell you so, not fail silently).

## Step 1 — Get all the files into GitHub

If you already have a GitHub repo for this site (from before):
1. Open that repo on github.com
2. Delete the old `index.html` (or just let the upload overwrite it)
3. Click "Add file" → "Upload files"
4. Drag in ALL of these, keeping the folder structure:
   - `index.html`
   - `admin.html`
   - `package.json`
   - the whole `api` folder (with `content.js`, `upload.js`, `verify.js` inside it)
5. Commit the changes (green button at the bottom)

If you don't have a repo yet: create a new one on github.com first
(New → Repository → name it, e.g. "desya-site" → Create), then follow
steps 3–5 above.

If that repo is already connected to Vercel, this commit alone will
trigger a new deployment automatically — but it won't fully work
until you finish Steps 2 and 3 below, because the site needs storage
and a password to exist first.

## Step 2 — Turn on storage (so images & content persist)

1. Go to vercel.com and open your project (import it from GitHub now
   via "Add New Project" if you haven't connected it yet)
2. Click the **Storage** tab
3. Click **Create Database** → choose **Blob**
4. Give it any name, click **Create**, then **Connect** it to this project
   (Vercel does this automatically in the same flow)

This is what actually stores your saved content and uploaded images —
without it, the admin page will show an error when you try to save.

## Step 3 — Set your admin password

1. In the same project, go to **Settings** → **Environment Variables**
2. Add a new variable:
   - Name: `ADMIN_PASSWORD`
   - Value: (a password only you know — pick something real, not "1234")
   - Environment: Production (and Preview if you want to test there too)
3. Click **Save**

I never see this password — it only lives in your Vercel account and
in your head.

## Step 4 — Redeploy

Environment variables and storage connections only take effect on a
fresh deployment:
1. Go to the **Deployments** tab
2. Click the "..." menu on the most recent deployment
3. Click **Redeploy**

## Step 5 — Use it

1. Visit `https://yoursite.vercel.app/admin`
2. Enter the password you set in Step 3
3. Edit any field, or click "Upload" under an image to replace it
4. Click **Save — publish live**
5. Refresh your actual site (`https://yoursite.vercel.app/`) — the
   change is there, for anyone, anywhere.

## If something doesn't work

- "Admin password is not configured" → you skipped Step 3, or forgot
  to Redeploy after adding it (Step 4).
- Save fails with a Blob-related error → Step 2 wasn't finished, or
  you saved before redeploying.
- Images won't upload → check the file is under 3MB.
- Forgot to set LEAD_FORM_ENDPOINT → it's already filled in with your
  Formspree address from before, no action needed.
