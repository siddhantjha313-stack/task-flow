# Git Repository Setup Guide

Use this document when you are ready to connect this project to GitHub and deploy it on Railway.

## 1. Initialize Git

```bash
git init
git add .
git commit -m "Initial TaskFlow AI full-stack app"
```

## 2. Create GitHub Repository

Create an empty GitHub repository named `taskflow-ai`, then connect it:

```bash
git branch -M main
git remote add origin https://github.com/<your-username>/taskflow-ai.git
git push -u origin main
```

## 3. Connect Railway

1. Open Railway and choose **New Project**.
2. Select **Deploy from GitHub repo**.
3. Pick `taskflow-ai`.
4. Add the environment variables from `.env.example`.
5. Use MongoDB Atlas for `MONGO_URI`.
6. Deploy.

## 4. Production Variables

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/taskflow-ai?retryWrites=true&w=majority
JWT_SECRET=<generate-a-long-secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://<your-railway-domain>
DEMO_SEED=false
```

## 5. Optional Demo Data

To seed demo data into Atlas from your machine:

```bash
cp .env.example server/.env
# edit server/.env with your Atlas MONGO_URI
npm run seed
```

After seeding:

- Admin: `admin@taskflow.ai` / `Taskflow@123`
- Member: `maya@taskflow.ai` / `Taskflow@123`
