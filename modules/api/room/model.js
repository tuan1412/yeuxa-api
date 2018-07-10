const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  userName: { type: String, ref: 'User' },
  body: { type: String, default: '' }
}, { timestamps: { createdAt: 'created_at' } });

const RoomSchema = new mongoose.Schema({
  members: { type: [String], default: [] },
  messages: { type: [MessageSchema], default: [] },
  active: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Room', RoomSchema);