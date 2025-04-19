const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
});

module.exports = mongoose.model('Task', TaskSchema);