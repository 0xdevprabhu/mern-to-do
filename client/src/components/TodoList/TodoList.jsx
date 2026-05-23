import React from 'react';
import TodoItem from '../TodoItem/TodoItem';
import { Sparkles } from 'lucide-react';
import './TodoList.css';

const TodoList = ({ tasks, onToggleComplete, onTogglePin, onDeleteTask, onUpdateTask }) => {
  return (
    <div className="todo-list-container">
      {tasks.length === 0 ? (
        <div className="todo-list-empty glass-panel animate-fade-in">
          <div className="empty-icon-wrapper">
            <Sparkles size={32} />
          </div>
          <h3 className="empty-title">All clear!</h3>
          <p className="todo-empty-text">No tasks found matching your filters. Add a task or clear filters to begin!</p>
        </div>
      ) : (
        <div className="todo-list-wrapper">
          {tasks.map((task) => (
            <TodoItem
              key={task._id}
              task={task}
              onToggleComplete={onToggleComplete}
              onTogglePin={onTogglePin}
              onDeleteTask={onDeleteTask}
              onUpdateTask={onUpdateTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;