TaskFlow AI
TaskFlow AI is a premium full-stack project and task management SaaS app built with React, Vite, Tailwind CSS, Framer Motion, shadcn-style UI primitives, Express, MongoDB, Mongoose, JWT auth, and role-based access control.

Features
JWT signup/login with protected routes and persistent sessions
Admin and member roles
Projects, tasks, assignees, comments, priorities, due dates, activity logs
Dashboard analytics, productivity chart, team progress, recent updates
Drag-and-drop Kanban board
Calendar view for deadlines
Team management and role updates
Dark/light mode, toast notifications, skeleton loaders, animated landing page
Railway-ready production configuration
Local Setup
npm install
cp .env.example server/.env
npm run seed
npm run dev
Client: http://localhost:5173
API: http://localhost:5000/api

Demo credentials after running npm run seed:

Admin: admin@taskflow.ai / Taskflow@123
Member: maya@taskflow.ai / Taskflow@123
Railway Deployment
Create a MongoDB Atlas database and copy the connection string.
Push this repository to GitHub.
Create a new Railway project from the GitHub repo.
Add variables from .env.example, especially:
NODE_ENV=production
MONGO_URI=<your MongoDB Atlas URI>
JWT_SECRET=<long random secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=<your Railway public URL>
Railway will run npm run build and then npm start.
Optionally run npm run seed locally against the Atlas URI once to create demo data.
Scripts
npm run dev      # run API and Vite together
npm run build    # build React client
npm start        # run Express server and serve client/dist
npm run seed     # seed demo users, projects, tasks, activity
npm run check    # lint and production build
Structure
client/   React + Vite frontend
server/   Express + Mongoose backend
docs/     Git/Railway deployment guide
