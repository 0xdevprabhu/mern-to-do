import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create Context
const TodoContext = createContext();

// Backend URL where Node.js server runs
const API_URL = 'http://localhost:5000/api/todos';

export const TodoProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // 1. Fetch tasks from MongoDB when the server starts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL);
        setTasks(response.data); // Original data from the server
      } catch (error) {
        console.error('Error fetching tasks:', error.message);
      }
    };
    fetchTasks();
  }, []);

  // 2. Save new task to MongoDB database
  const addTask = async (taskData) => {
    try {
      // Allow passing either a string title or a full task object
      const data = typeof taskData === 'string' ? { title: taskData } : taskData;
      const response = await axios.post(API_URL, data);
      // Add the newly saved task from database to the state
      setTasks((prevTasks) => [response.data, ...prevTasks]);
    } catch (error) {
      console.error('Error creating task:', error.message);
    }
  };

  // 3. Update generic task details in MongoDB
  const updateTask = async (id, updatedFields) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedFields);
      // Update only the updated task in frontend state
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? response.data : task))
      );
    } catch (error) {
      console.error('Error updating task:', error.message);
    }
  };

  // 4. Toggle completion status
  const toggleComplete = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (task) {
      await updateTask(id, { completed: !task.completed });
    }
  };

  // 5. Toggle pinned status
  const togglePin = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (task) {
      await updateTask(id, { pinned: !task.pinned });
    }
  };

  // 6. Delete task from MongoDB
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      // Remove deleted task from frontend state
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  return (
    <TodoContext.Provider value={{ tasks, addTask, updateTask, toggleComplete, togglePin, deleteTask }}>
      {children}
    </TodoContext.Provider>
  );
};

// Custom Hook - to easily use context in components
export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};