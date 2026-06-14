# Pocket Buddy 💜

A personal life management app with an AI companion that helps students and young professionals track their finances, health, journal, goals, and menstrual cycles — all in one place.

## Features

- **AI Companion** — Chat with a personalized AI best friend (powered by AWS Bedrock Nova + Gemini fallback) that can auto-log expenses and health data from natural conversation
- **Money Tracker** — Track income/expenses by category with spending breakdowns and charts
- **Health Tracker** — Log sleep, steps, water intake, heart rate, and daily habits
- **Journal** — Mood-based journaling with tags and past entry history
- **Goals** — Set, track, and complete personal goals across finance, health, learning, and more
- **Cycle Tracker** — Log periods, predict next cycle, fertile window, and ovulation
- **Reports** — Monthly overview of spending vs saving trends, wellness scores, and AI insights
- **Dashboard** — Daily snapshot of budget, spending, stress level, and sleep

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, Recharts, Axios |
| Auth | Clerk (Google OAuth + Email) |
| Backend | FastAPI (Python 3.12), Uvicorn |
| Database | AWS DynamoDB |
| AI | AWS Bedrock (Nova Lite/Micro), Google Gemini |
| Deployment | Vercel (frontend), AWS EC2 (backend) |

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── routes/              # API route handlers
│   │   ├── auth.py          # Onboarding & profile
│   │   ├── journal.py       # Journal CRUD
│   │   ├── money.py         # Transaction CRUD
│   │   ├── health.py        # Health logs
│   │   ├── goals.py         # Goals CRUD
│   │   ├── cycle.py         # Menstrual cycle tracker
│   │   └── companion.py     # AI chat with auto-detection
│   ├── models/              # Pydantic request models
│   ├── services/dynamodb.py # DynamoDB operations
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/           # All page components
│   │   ├── components/      # Sidebar, TopBar, Layout, Theme
│   │   ├── hooks/           # useMediaQuery for responsive
│   │   └── api.js           # Axios instance
│   └── package.json
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 20+
- AWS account with DynamoDB tables configured
- Clerk account for authentication
- (Optional) Google Gemini API key

### Environment Variables

**Backend** (`backend/.env`):
```
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
GEMINI_API_KEY=your_gemini_key
```

**Frontend** (`frontend/.env`):
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_BACKEND_URL=http://localhost:8000
```

### Run with Docker

```bash
docker-compose up
```
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

### Run Manually

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

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
| POST | `/goals/` | Create goal |
| PATCH | `/goals/update` | Update goal progress |
| POST | `/cycle/log` | Log period |
| GET | `/cycle/{id}` | Get cycle history + predictions |
| POST | `/companion/chat` | AI chat |

## DynamoDB Tables

- `AmazeOnUsers` — User profiles (partition key: `userId`)
- `JournalEntries` — Journal entries (partition: `userId`, sort: `entry_id`)
- `Money` — Transactions (partition: `userId`, sort: `transaction_id`)
- `Health` — Daily health logs (partition: `userId`, sort: `date`)
- `Goals` — Personal goals (partition: `userId`, sort: `goal_id`)
- `CycleTracker` — Period logs (partition: `userId`, sort: `period_id`)

## Team

Built with 💜 by Team Amaze-On.
