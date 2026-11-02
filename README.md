# 🤖 MiniBot – AI-Powered Telegram Study Planner

An intelligent Telegram bot designed to help students organize and manage their study tasks using Artificial Intelligence.

## 📌 About the Project

MiniBot is an AI-powered study planning assistant developed using Cloudflare Workers, Workers AI, and Cloudflare D1.

Users can interact with the bot in Persian using natural language to add, view, complete, undo, and delete their study tasks.

The main goal of this project is to demonstrate how cloud computing services and AI can be integrated to build a practical serverless application.

## ✨ Features

- Add new study tasks using natural language
- View saved tasks
- Mark tasks as completed
- Undo completed tasks
- Delete tasks
- Persian-language interaction
- Store user tasks in a cloud database
- AI-powered message understanding

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Cloudflare Workers | Serverless backend |
| Cloudflare Workers AI | Natural language processing |
| Cloudflare D1 | Database |
| Telegram Bot API | User interaction |
| JavaScript | Application logic |
| SQL | Database structure |

## 🏗️ Architecture

```text
Telegram User
     |
     v
Telegram Bot API
     |
     v
Cloudflare Worker
     |
     +------> Workers AI
     |        Message understanding
     |
     +------> Cloudflare D1
     |        Task storage
     |
     v
Telegram Response
```

## 📂 Project Structure

```text
MiniBot-AI-Study-Planner/
│
├── src/
│   └── worker.js
│
├── database/
│   └── schema.sql
│
└── README.md
```

## 🗄️ Database

The project uses Cloudflare D1, a serverless SQL database.

The `tasks` table stores:

- Task ID
- User ID
- Task title
- Subject
- Due date
- Task status
- Creation timestamp

## 🔐 Security

- Telegram Bot Token is stored as an environment secret.
- Telegram Webhook Secret is stored securely.
- User-specific database queries are used to separate tasks.
- SQL parameter binding is used for database operations.

## 🚀 Deployment

The application is deployed using Cloudflare Workers.

Required environment bindings and secrets:

- `AI`
- `DB`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET`

Sensitive values must never be committed to the repository.

## 🎯 Future Improvements

- Automatic study reminders
- Weekly study schedules
- Task prioritization
- Progress reports
- Improved Persian language understanding
- More advanced planning features

## 👩‍💻 Author

Developed as a Cloud Computing course project.

**Project:** MiniBot – AI-Powered Telegram Study Planner

---

*Built with Cloudflare Workers, Workers AI, D1, and Telegram Bot API.*
