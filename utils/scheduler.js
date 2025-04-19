const cron = require('node-cron');
const Task = require('../models/Task');

const scheduleReminders = (bot) => {
  cron.schedule('*/1 * * * *', async () => {
    const now = new Date();
    const hourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const tasks = await Task.find({ dueDate: { $gte: now, $lte: hourLater } });

    tasks.forEach(task => {
      bot.sendMessage(task.userId, `⏰ Reminder!\nTask: ${task.description}\nDue: ${task.dueDate}`);
    });
  });
};

const scheduleDailySummary = (bot) => {
  cron.schedule('0 9 * * *', async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tasks = await Task.find({ dueDate: { $gte: today, $lt: tomorrow } });
    const grouped = {};

    tasks.forEach(task => {
      if (!grouped[task.userId]) grouped[task.userId] = [];
      grouped[task.userId].push(`• ${task.description} (Due: ${task.dueDate})`);
    });

    for (let userId in grouped) {
      bot.sendMessage(userId, `📋 Daily Summary:\n` + grouped[userId].join('\n'));
    }
  });
};

module.exports = { scheduleReminders, scheduleDailySummary };