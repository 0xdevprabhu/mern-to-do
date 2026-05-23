const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    category: {
      type: String,
      default: 'general'
    },
    dueDate: {
      type: Date,
      default: null
    },
    pinned: {
      type: Boolean,
      default: false
    },
    subtasks: [
      {
        title: {
          type: String,
          required: true,
          trim: true
        },
        completed: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Todo', TodoSchema);