# Pocket Buddy 💜

> Your AI-powered personal life companion for students and young professionals.

---

## 🎯 Problem We're Solving

Students and young professionals juggle **finances, health, mental wellness, and goals** across multiple disconnected apps. There's no single place that understands them holistically — and no one to talk to at 2 AM when stressed about money or health.

**Pocket Buddy** solves this by combining life tracking with a personalized AI best friend that knows your context, auto-logs data from conversations, and proactively supports your well-being.

---

## 💡 How We Solve It

- **One unified dashboard** — Budget, spending, health, sleep, goals, and mood in one view
- **AI Companion** — A named AI best friend (you choose the name!) powered by AWS Bedrock Nova + Google Gemini that can chat naturally AND auto-detect loggable data ("I spent ₹200 on lunch" → automatically logs expense)
- **Smart tracking** — Journal with mood analysis, expense categorization, health habits, goal progress, and menstrual cycle predictions
- **Zero friction** — Just talk to your AI friend; it handles the rest

---

## 🏗️ Tech Architecture

![Tech Architecture](./architecture.svg)

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, Recharts, Axios |
| Auth | Clerk (Google OAuth + Email/Password) |
| Backend | FastAPI (Python 3.12), Uvicorn |
| Database | AWS DynamoDB (6 tables) |
| AI | AWS Bedrock (Nova Lite/Micro), Google Gemini (fallback) |
| Deployment | Vercel (frontend), AWS EC2 (backend) |
| Containerization | Docker + docker-compose |

---

## 🚀 Live Demo

- **Frontend:** [amaze-on.vercel.app](https://amaze-on-vanessas-projects-583e2db4.vercel.app)
- **Backend API:** Hosted on AWS EC2

---

## 🖥️ Getting Started (Local Development)

### Prerequisites

- Python 3.12+
- Node.js 20+
- AWS credentials (DynamoDB access)
- Clerk publishable key
- Gemini API key

### 1. Clone the repo

```bash
git clone https://github.com/vanessaashrie/Amaze-On.git
cd Amaze-On
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:
```
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
GEMINI_API_KEY=your_gemini_key
```

Run:
```bash
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_BACKEND_URL=http://localhost:8000
VITE_API_URL=http://localhost:8000
```

Run:
```bash
npm run dev
```

### 4. Or use Docker

```bash
docker-compose up
```
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 AI Companion | Named AI best friend that chats, motivates, and auto-logs data |
| 💰 Money Tracker | Income/expense tracking with category breakdown and charts |
| ❤️ Health Tracker | Sleep, steps, water, heart rate, BMI, daily habits |
| 📓 Journal | Mood-based journaling with tags and history |
| 🎯 Goals | Set, track, and complete goals across categories |
| 🩸 Cycle Tracker | Period logging with next cycle & fertility predictions |
| 📊 Reports | Monthly wellness score, spending vs saving trends, AI insights |
| 📱 Responsive | Works on desktop, tablet, and mobile |
| 🌙 Dark Mode | Persists across sessions |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/onboarding` | Save user profile |
| GET | `/auth/profile/{id}` | Get user profile |
| POST | `/journal/` | Create journal entry |
| GET | `/journal/{id}` | List journal entries |
| POST | `/money/` | Add transaction |
| GET | `/money/{id}` | List transactions |
| POST | `/health/` | Log health data |
| GET | `/health/{id}` | Get health logs |
| GET | `/health/{id}/today` | Get today's log |
| POST | `/goals/` | Create goal |
| GET | `/goals/{id}` | List goals |
| PATCH | `/goals/update` | Update goal progress |
| POST | `/cycle/log` | Log period |
| GET | `/cycle/{id}` | Get cycle history + predictions |
| POST | `/companion/chat` | AI chat with auto-detection |

---

## 🗄️ Database Schema (DynamoDB)

| Table | Partition Key | Sort Key |
|-------|--------------|----------|
| AmazeOnUsers | userId | — |
| JournalEntries | userId | entry_id |
| Money | userId | transaction_id |
| Health | userId | date |
| Goals | userId | goal_id |
| CycleTracker | userId | period_id |

---

## 📂 Project Structure

```
├── backend/
│   ├── main.py                 # FastAPI entry point
│   ├── routes/                 # API route handlers
│   │   ├── auth.py             # Onboarding & profile
│   │   ├── companion.py        # AI chat + auto-detection
│   │   ├── journal.py          # Journal CRUD
│   │   ├── money.py            # Transactions
│   │   ├── health.py           # Health logs
│   │   ├── goals.py            # Goals CRUD
│   │   └── cycle.py            # Menstrual cycle tracker
│   ├── models/                 # Pydantic request models
│   ├── services/dynamodb.py    # All DynamoDB operations
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/              # All page components
│   │   ├── components/         # Sidebar, TopBar, Layout, Theme
│   │   ├── hooks/              # useMediaQuery (responsive)
│   │   └── api.js              # Axios instance + helpers
│   └── package.json
├── docker-compose.yml
└── architecture.svg
```

---

## 👥 Team

Built with 💜 by **Team Amaze-On**
