# Pocket Buddy 💜

> An end-to-end AI-powered life companion built with a customer-first approach — designed to make every customer's daily life simpler, healthier, and more organized.

---

## 🎯 Customer Problem

We started by working backwards from the customer. Our customers — students and young professionals — told us they feel overwhelmed managing money, health, and personal goals across disconnected apps. They have no single, personalized space that truly understands their needs — and no support system available when they need it most.

**Pocket Buddy** is our end-to-end solution: a customer-centric platform that combines life tracking with a personalized AI companion, delivering the right support at the right time — all in one place.

---

## 💡 How We Deliver Value to the Customer

We obsessed over the customer experience at every step:

- **One unified dashboard** — Customers see their budget, spending, health, sleep, goals, and mood in a single view. No switching between apps.
- **AI Companion** — Every customer gets a named AI best friend (they choose the name!) that chats naturally and automatically saves data the customer mentions ("I spent ₹200 on lunch" → expense logged instantly)
- **Smart tracking** — The customer's journal, expenses, health habits, goal progress, and cycle predictions are all connected — giving them a holistic view of their life
- **Zero effort for the customer** — Customers just talk to their AI friend; the system handles everything behind the scenes

---

## 🏗️ How It's Built (End-to-End Architecture)

![Tech Architecture](./architecture.svg)

We built an end-to-end solution using scalable AWS services to ensure every customer gets a fast, reliable experience:

| Layer | Technology |
|-------|-----------|
| Frontend (what customers see) | React 18 (UI library), Vite (build tool), React Router (page navigation), Recharts (charts), Axios (API calls) |
| Login & Authentication | Clerk (handles Google sign-in and email/password login for customers) |
| Backend (server logic) | FastAPI (a Python web framework), Uvicorn (a lightweight server runner) |
| Database (customer data storage) | AWS DynamoDB (a cloud-hosted NoSQL database with 6 tables) |
| AI (customer-facing smart features) | AWS Bedrock Nova Lite/Micro (Amazon's AI models), Google Gemini (backup AI) |
| Hosting | Vercel (hosts the customer-facing app), AWS EC2 (hosts the backend server) |
| Local packaging (run everything together) | Docker + docker-compose (bundles the app so it runs anywhere) |

---

## 🚀 Live Demo

- **Customer App:** [amaze-on.vercel.app](https://amaze-on-vanessas-projects-583e2db4.vercel.app)
- **Server:** Hosted on AWS

---

## 🖥️ Run It on Your Computer

### What You Need First

- Python 3.12 or newer
- Node.js 20 or newer
- AWS credentials (to connect to the database)
- A Clerk account key (used for customer login)
- A Gemini API key (for the AI companion)

### 1. Clone the repo (download the code)

```bash
git clone https://github.com/vanessaashrie/Amaze-On.git
cd Amaze-On
```

### 2. Set Up the Server

```bash
cd backend
pip install -r requirements.txt
```

Create a file called `backend/.env` and add:
```
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
GEMINI_API_KEY=your_gemini_key
```

Start the server:
```bash
uvicorn main:app --reload --port 8000
```

### 3. Set Up the App

```bash
cd frontend
npm install
```

Create a file called `frontend/.env` and add:
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_BACKEND_URL=http://localhost:8000
VITE_API_URL=http://localhost:8000
```

Start the website:
```bash
npm run dev
```

### 4. Or use Docker (runs everything in one command)

```bash
docker-compose up
```
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

---

## ✨ Features (What Customers Get)

Every feature was designed by working backwards from what customers actually need:

| Feature | Customer Benefit |
|---------|-----------------|
| 🤖 AI Companion | A personal AI best friend that chats, motivates, and automatically saves data customers mention |
| 💰 Money Tracker | Customers track money in and out, grouped by category, with visual charts |
| ❤️ Health Tracker | Customers log sleep, steps, water, heart rate, BMI (body mass index), and daily habits |
| 📓 Journal | Customers write diary entries with mood labels and view their history |
| 🎯 Goals | Customers set, track, and complete personal goals across categories |
| 🩸 Cycle Tracker | Customers log periods and get next cycle & fertility predictions |
| 📊 Reports | Customers see monthly wellness scores, spending vs saving trends, and AI-generated insights |
| 📱 Works on all screen sizes | Customers can use it on desktop, tablet, or mobile |
| 🌙 Dark Mode | Stays on even after the customer closes the app |

---

## 📡 API Reference (for developers)

| Method | Endpoint | What It Does |
|--------|----------|-------------|
| POST | `/auth/onboarding` | Save customer profile during sign-up |
| GET | `/auth/profile/{id}` | Get a customer's saved profile |
| POST | `/journal/` | Create a new journal entry for the customer |
| GET | `/journal/{id}` | Get all journal entries for a customer |
| POST | `/money/` | Add a new income or expense for the customer |
| GET | `/money/{id}` | Get all transactions for a customer |
| POST | `/health/` | Log health data (sleep, steps, etc.) for the customer |
| GET | `/health/{id}` | Get health logs for a customer |
| GET | `/health/{id}/today` | Get today's health log for the customer |
| POST | `/goals/` | Create a new goal for the customer |
| GET | `/goals/{id}` | Get all goals for a customer |
| POST | `/goals/update` | Update a customer's goal progress |
| POST | `/cycle/log` | Log a period entry for the customer |
| GET | `/cycle/{id}` | Get cycle history + predicted dates for the customer |
| POST | `/companion/chat` | Send a message to the customer's AI companion |

---

## 🗄️ How Customer Data is Stored

Each table stores a different type of customer data in AWS DynamoDB (a cloud database), ensuring fast reads and writes at any scale:

| Table | Main Key | Sort Key |
|-------|----------|----------|
| AmazeOnUsers | userId | — |
| JournalEntries | userId | entry_id |
| Money | userId | transaction_id |
| Health | userId | date |
| Goals | userId | goal_id |
| CycleTracker | userId | period_id |

---

## 📂 Project Structure (How Files Are Organized)

```
├── backend/
│   ├── main.py                 # Server starting point
│   ├── routes/                 # Handles requests for each customer feature
│   │   ├── auth.py             # Customer onboarding & profile
│   │   ├── companion.py        # AI chat + automatic data saving
│   │   ├── journal.py          # Customer journal entries
│   │   ├── money.py            # Customer transactions
│   │   ├── health.py           # Customer health logs
│   │   ├── goals.py            # Customer goals
│   │   └── cycle.py            # Customer cycle tracker
│   ├── models/                 # Data format definitions
│   ├── services/dynamodb.py    # All database read/write operations
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/              # Each screen the customer interacts with
│   │   ├── components/         # Sidebar, TopBar, Layout, Theme
│   │   ├── hooks/              # Detects screen size for layout
│   │   └── api.js              # Handles all server communication
│   └── package.json
├── docker-compose.yml
└── architecture.svg
```

---

## 🔄 Customer Backwards Approach

We followed the **Customer Backwards** principle throughout development:

1. **Started with the customer pain point** — Not the technology. We interviewed students and identified their top struggles: fragmented tracking, no personal support, and app fatigue.
2. **Designed the end-to-end customer experience first** — Before writing a single line of code, we mapped the ideal customer journey from sign-up to daily use.
3. **Built features customers asked for** — Every feature (AI companion, money tracker, cycle predictor) came directly from customer feedback.
4. **Measured success by customer outcomes** — Does the customer feel less stressed? Can they track their life in under 30 seconds? Is the AI actually helpful?

---

## 👥 Team

Built with 💜 by **Team Amaze-On** — obsessed with making our customers' lives better.
