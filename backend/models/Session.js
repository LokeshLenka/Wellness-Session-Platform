const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Session must be at least 1 minutes']
    },
    tags: {
      type: [String],
      default: []
    },
    content: {
      type: Object,
      required: [true, 'Session content is required']
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Session', SessionSchema);
