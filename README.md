# 📋 Dootly Telegram Task Management Bot

A feature-rich Telegram bot built with **Node.js**, **MongoDB**, and **node-telegram-bot-api** that allows users to manage tasks, receive reminders, and get daily summaries — all through Telegram.

---

## 🚀 Features

- ✅ User Registration
- ✍️ Create, Update, Delete Tasks
- 📋 List Tasks with IDs and Due Dates
- ⏰ Automatic Reminders (1 hour before due)
- 📅 Daily Summary of Pending Tasks
- 💾 MongoDB for Persistent Storage

---

## 🔧 Technologies Used

- Node.js
- MongoDB with Mongoose
- node-telegram-bot-api
- dotenv
- node-cron (for scheduling)

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git https://github.com/Fahad2122/Dootly.gitt
cd Dootly
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a .env file in the root directory and add:
```bash
BOT_TOKEN=your_telegram_bot_token
MONGO_URI=your_mongodb_connection_string
```

### 4. Running the Bot Locally
```bash
node bot.js
```