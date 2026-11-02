# MiniBot – Technical Documentation
## AI-Powered Telegram Study Planner

**Project:** MiniBot  
**Course:** Cloud Computing  
**Platform:** Cloudflare Workers  
**Programming Language:** JavaScript  
**Database:** Cloudflare D1  
**AI Model:** `@cf/meta/llama-3.3-70b-instruct-fp8-fast`

---

## 1. Project Overview

MiniBot is an AI-powered Telegram bot designed to help students organize and manage their study tasks.

The bot allows users to communicate in Persian using natural language. Instead of using complicated commands, users can describe their study tasks in ordinary sentences.

MiniBot uses Cloudflare Workers AI to understand user messages and Cloudflare D1 to store and manage study tasks.

The main purpose of this project is to demonstrate the integration of Artificial Intelligence, serverless computing, cloud databases, and messaging APIs in a practical application.

## 2. Project Objectives

The main objectives of MiniBot are:

- Simplifying study task management.
- Understanding natural language messages.
- Providing an easy-to-use Telegram interface.
- Storing study tasks in a cloud database.
- Demonstrating serverless application development.
- Integrating AI services with cloud computing infrastructure.

## 3. System Architecture

MiniBot follows a serverless architecture based on Cloudflare services.

The main components are:

### 3.1 Telegram Bot API

Telegram provides the user interface. Users send messages to the bot, and the bot sends responses back through the Telegram Bot API.

### 3.2 Cloudflare Workers

Cloudflare Workers acts as the backend of the application.

It receives incoming webhook requests from Telegram, processes messages, communicates with AI and the database, and sends responses to users.

### 3.3 Cloudflare Workers AI

Workers AI is responsible for understanding natural language messages.

The project uses the following model:

`@cf/meta/llama-3.3-70b-instruct-fp8-fast`

The model receives the user's message and generates a structured response that the Worker uses to determine the requested action.

### 3.4 Cloudflare D1

Cloudflare D1 is a serverless SQL database used to store study tasks.

It allows the application to save, retrieve, update, and delete task records.

## 4. System Workflow

The general workflow is:

1. The user sends a message to the Telegram bot.
2. Telegram sends the message to the Cloudflare Worker through a webhook.
3. The Worker validates the incoming request.
4. The user's message is sent to Workers AI.
5. The AI model analyzes the message and determines the intended action.
6. The Worker processes the requested operation.
7. If necessary, the Worker communicates with Cloudflare D1.
8. The result is sent back to the user through Telegram.

### Architecture Diagram

```text
        Telegram User
              |
              v
       Telegram Bot API
              |
           Webhook
              |
              v
      Cloudflare Worker
              |
       +------+------+
       |             |
       v             v
   Workers AI     Cloudflare D1
   Message        Task Storage
   Understanding      |
       |               |
       +-------+-------+
               |
               v
       Telegram Bot API
               |
               v
          User Response
```

## 5. Main Features

MiniBot supports the following operations:

### 5.1 Add Tasks

Users can describe a new study task in Persian.

The AI model analyzes the message and extracts the task information. The Worker then stores the task in the database.

### 5.2 List Tasks

Users can request their saved tasks.

The Worker retrieves the relevant records from the D1 database and prepares a response.

### 5.3 Complete Tasks

Users can mark a task as completed.

The task status is updated in the database.

### 5.4 Undo Completed Tasks

Users can change a completed task back to pending status.

### 5.5 Delete Tasks

Users can request the deletion of a saved task.

The Worker processes the request and removes the corresponding record.

### 5.6 Natural Language Interaction

Users can interact with the bot using ordinary Persian sentences.

The AI model helps identify the user's intention and convert the message into structured information.

## 6. Database Design

The project uses Cloudflare D1, which provides a serverless SQL database.

The database name is:

`study_planner_db`

The main table is:

`tasks`

### 6.1 Tasks Table Structure

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Unique task identifier |
| user_id | TEXT | Telegram user identifier |
| title | TEXT | Task title |
| subject | TEXT | Related subject |
| due_date | TEXT | Task deadline |
| status | TEXT | Task status |
| created_at | DATETIME | Task creation time |

### 6.2 Database Schema

```sql
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    subject TEXT,
    due_date TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id
ON tasks(user_id);
```

The `user_id` field is used to associate tasks with their owners.

The database index helps organize queries that retrieve tasks belonging to a specific user.

## 7. Technologies Used

| Technology | Role |
|---|---|
| JavaScript | Backend application logic |
| Telegram Bot API | Communication with users |
| Cloudflare Workers | Serverless backend |
| Cloudflare Workers AI | Natural language understanding |
| Cloudflare D1 | Cloud database |
| SQL | Database operations |
| HTTP Webhook | Receiving Telegram updates |

## 8. Cloudflare Configuration

The application requires the following Cloudflare bindings and environment secrets.

### Bindings

- `AI`: Provides access to Workers AI.
- `DB`: Connects the Worker to the D1 database.

### Environment Secrets

- `TELEGRAM_BOT_TOKEN`: Used to authenticate requests to the Telegram Bot API.
- `TELEGRAM_WEBHOOK_SECRET`: Used to validate incoming webhook requests.

Sensitive values are configured in the Cloudflare dashboard and are not stored directly in the source code.

## 9. Security Considerations

Several security measures are used in the project:

- The Telegram Bot Token is stored as an environment secret.
- The webhook secret is used to validate incoming Telegram requests.
- Database queries use parameter binding.
- Task queries use the Telegram user ID to separate users' records.
- Sensitive credentials should never be committed to a public GitHub repository.

## 10. Project Structure

```text
MiniBot-AI-Study-Planner/
│
├── src/
│   └── worker.js
│
├── database/
│   └── schema.sql
│
├── documentation/
│   └── Technical-Documentation.md
│
└── README.md
```

## 11. Testing

The bot can be tested by sending different Persian messages through Telegram.

Suggested test cases include:

- Adding a new study task.
- Requesting the list of saved tasks.
- Marking a task as completed.
- Returning a completed task to pending status.
- Deleting a task.
- Sending a general message to the assistant.

The expected result is that the Worker identifies the requested operation, performs the corresponding action, and sends a response through Telegram.

## 12. Limitations

The current version is a basic study-planning assistant.

Possible limitations include:

- AI interpretation may not always be completely accurate.
- Complex or ambiguous messages may require clearer wording.
- Advanced scheduling and automatic reminders are not included in the current version.
- The system depends on the availability of Telegram and Cloudflare services.

## 13. Future Improvements

Possible future improvements include:

- Automatic study reminders.
- Weekly study planning.
- Task prioritization.
- Progress tracking and reports.
- Improved natural language understanding.
- More advanced time and deadline management.
- A graphical dashboard for managing tasks.

## 14. Conclusion

MiniBot demonstrates how cloud computing and artificial intelligence can be combined to build a practical application.

By integrating Telegram Bot API, Cloudflare Workers, Workers AI, and Cloudflare D1, the project provides a simple platform for managing study tasks through natural language.

This project is an example of a serverless application that uses cloud infrastructure to provide AI-powered services.

---

**MiniBot – AI-Powered Telegram Study Planner**  
*Developed as a Cloud Computing course project.*
