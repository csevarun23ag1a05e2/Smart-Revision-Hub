const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  priority: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);
