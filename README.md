# 🚀 HackPitch AI

HackPitch AI is an intelligent, full-stack MVP built for hackathons. It allows users to input a simple problem statement and instantly leverages **Featherless AI** (via OpenAI-compatible endpoints) to generate a fully structured, multi-page presentation pitch deck. 

## ✨ Features
- **AI-Powered Pitch Generation**: Transforms a single sentence into a multi-page startup pitch using `Qwen/Qwen2.5-7B-Instruct`.
- **Clean UI**: Beautiful, dark-mode focused UI built with Tailwind CSS.
- **Local Persistence**: Stores all generated pitches and upvotes in a local SQLite database using Prisma ORM.
- **One-Click Deploy**: Comes with a `render.yaml` Blueprint for instant, persistent deployment on Render.

## 🛠️ Tech Stack
- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS (CDN)
- **Backend**: Node.js, Express.js
- **Database**: SQLite (local/disk), Prisma ORM
- **AI Integration**: Featherless AI (OpenAI SDK)

---

## 💻 Local Development Setup

Follow these instructions to run HackPitch AI on your local machine.

### 1. Clone the repository
```bash
git clone https://github.com/samarthjoshi02/HackPitch-AI.git
cd HackPitch-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your Featherless AI API key and database URL:
```env
FEATHERLESS_API_KEY="your_api_key_here"
DATABASE_URL="file:./dev.db"
```

### 4. Initialize the Database
Run Prisma to create the SQLite database and sync the schema:
```bash
npm run db:init
```

### 5. Start the Server
Launch the API and static file server:
```bash
npm start
```
Your app will be live at: **`http://localhost:3000`**

---

## ☁️ Deployment (Render)

This project is fully configured to be deployed on [Render.com](https://render.com) using the included Blueprint.

1. Go to your Render Dashboard and click **New > Blueprint**.
2. Connect this GitHub repository.
3. When prompted, input your `FEATHERLESS_API_KEY`.
4. Render will automatically build the app, set up a persistent disk at `/data` (to save your SQLite database across restarts), and launch the server!

## 📜 License
MIT License
