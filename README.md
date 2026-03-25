# Web Traffic Analyzer (Simplified Google Analytics)

## Features
- Real-time visitor tracking
- Dashboard with charts (Chart.js)
- Responsive UI with dark mode
- Backend: Node.js/Express/MongoDB
- Automatic tracking script
- Aggregations: total/unique/daily/weekly/monthly/top pages
- Crash-proof with error handling

## Quick Setup (Windows CMD/PowerShell)
1. `cd traffic-analyzer\server`
2. `npm install`
3. Copy `.env.example` to `.env`, set `MONGO_URI` (MongoDB Atlas free tier recommended: create free cluster at mongodb.com/atlas)
4. `npm start` (runs on port 3000)
5. Open `..\public\index.html` in browser (or `npx live-server ..\public` from server dir)

**MongoDB Atlas Setup:**
1. Sign up at mongodb.com/atlas
2. Create free M0 cluster
3. Add IP whitelist 0.0.0.0/0
4. Get connection string: `mongodb+srv://<username>:<password>@cluster.../traffic_analyzer`
5. Update .env MONGO_URI
6. Visit pages with `<script src=\"tracker.js\"></script>` to simulate traffic

## Folder Structure
```
traffic-analyzer/
├── public/         # Frontend (HTML/CSS/JS)
├── server/         # Backend (Node/Express)
│   ├── server.js
│   ├── models/
│   └── package.json
├── TODO.md         # Progress tracker
└── README.md
```

## APIs
- `POST http://localhost:3000/track` - Track visit
- `GET http://localhost:3000/stats` - Get analytics

## Tech Stack
- Frontend: HTML/CSS/JS, Chart.js, Flexbox/Grid
- Backend: Express, Mongoose, MongoDB
- No frameworks needed

**College Viva Ready: Clean, modern, full-stack project with best practices.**

