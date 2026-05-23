const Todo = require('../models/Todo');

// 1. Get All Tasks (அனைத்து டாஸ்க்குகளையும் எடுக்க)
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ pinned: -1, createdAt: -1 }); // Pinned tasks first, then newest
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// 2. Create New Task (புதிய டாஸ்க் ஆட் செய்ய)
exports.createTodo = async (req, res) => {
  try {
    const { title, description, priority, category, dueDate, pinned, subtasks } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }
    const newTodo = await Todo.create({
      title,
      description,
      priority,
      category,
      dueDate,
      pinned,
      subtasks: subtasks || []
    });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// 3. Update Task (டாஸ்க் விபரங்களை அப்டேட் செய்ய)
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If body is empty, we toggle completed status (backwards compatibility)
    if (Object.keys(req.body).length === 0) {
      todo.completed = !todo.completed;
    } else {
      // Update any fields provided in the body
      const fields = ['title', 'description', 'completed', 'priority', 'category', 'dueDate', 'pinned', 'subtasks'];
      fields.forEach(field => {
        if (req.body[field] !== undefined) {
          todo[field] = req.body[field];
        }
      });
    }

    await todo.save();
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// 4. Delete Task (டாஸ்க்கை டெலிட் செய்ய)
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};