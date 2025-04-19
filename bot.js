require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const Task = require('./models/Task');
const { scheduleReminders, scheduleDailySummary } = require('./utils/scheduler');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const registeredUsers = new Set();

bot.onText(/\/register/, (msg) => {
    if (registeredUsers.has(msg.chat.id)) {
        return bot.sendMessage(msg.chat.id, `👑 You are already registered, my king!`);
    }
    registeredUsers.add(msg.chat.id);
    bot.sendMessage(msg.chat.id, `🎉 You are now registered!\nLet’s conquer those tasks together 💪`);
});

bot.onText(/\/create_task (.+) (\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/, async (msg, match) => {
    const [_, description, dueDate] = match;
    if (!description || !dueDate) {
        return bot.sendMessage(msg.chat.id, `⚠️ Please provide a valid description and due date in the format YYYY-MM-DDTHH:MM`);
    }
    if (!registeredUsers.has(msg.chat.id)) {
        return bot.sendMessage(msg.chat.id, `🔒 Please /register first to use this feature.`);
    }

    try {
        const task = await Task.create({ userId: msg.chat.id, description, dueDate });
        bot.sendMessage(msg.chat.id, `✅ *Task Created!*\n🆔 *ID:* \`${task._id}\`\n📌 *Description:* ${description}\n⏰ *Due:* ${dueDate}`, { parse_mode: "Markdown" });
    } catch (err) {
        bot.sendMessage(msg.chat.id, `❌ Failed to create task. Please try again or check your date format.`);
    }
});

bot.onText(/\/update_task (\w+) (.+) (\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/, async (msg, match) => {
    const [_, id, desc, date] = match;
    if (!id || !desc || !date) {
        return bot.sendMessage(msg.chat.id, `⚠️ Please provide a valid task ID, description, and due date in the format YYYY-MM-DDTHH:MM`);
    }
    try {
        const task = await Task.findByIdAndUpdate(id, { description: desc, dueDate: date });
        if (!task) return bot.sendMessage(msg.chat.id, `⚠️ Task not found with ID: ${id}`);
        bot.sendMessage(msg.chat.id, `🔁 *Task Updated Successfully!*\n🆔 \`${id}\`\n📌 *New Description:* ${desc}\n⏰ *New Due:* ${date}`, { parse_mode: "Markdown" });
    } catch (err) {
        bot.sendMessage(msg.chat.id, `❌ Couldn't update the task. Please double-check the ID or input.`);
    }
});

bot.onText(/\/delete_task (\w+)/, async (msg, match) => {
    const [_, id] = match;
    if (!id) {
        return bot.sendMessage(msg.chat.id, `⚠️ Please provide a valid task ID.`);
    }
    try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) return bot.sendMessage(msg.chat.id, `⚠️ Task not found with ID: ${id}`);
        bot.sendMessage(msg.chat.id, `🗑️ *Task Deleted Successfully!*\n🆔 \`${id}\``, { parse_mode: "Markdown" });
    } catch (err) {
        bot.sendMessage(msg.chat.id, `❌ Deletion failed. Please check the task ID.`);
    }
});

bot.onText(/\/list_tasks/, async (msg) => {
    try {
        const tasks = await Task.find({ userId: msg.chat.id });
        if (!tasks.length) return bot.sendMessage(msg.chat.id, "📭 You have no tasks right now. Go ahead and /create_task!");

        const list = tasks.map(t =>
            `🆔 \`${t._id}\`\n📌 *${t.description}*\n⏰ *Due:* ${new Date(t.dueDate).toLocaleString()}`
        ).join('\n\n');

        bot.sendMessage(msg.chat.id, `📝 *Your Tasks:*\n\n${list}`, { parse_mode: "Markdown" });
    } catch (err) {
        bot.sendMessage(msg.chat.id, `❌ Couldn't fetch tasks at the moment. Try again later.`);
    }
});

scheduleReminders(bot);
scheduleDailySummary(bot);
