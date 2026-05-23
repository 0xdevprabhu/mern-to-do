import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Calendar, Tag, AlertTriangle, MessageSquare } from 'lucide-react';
import './TodoInput.css';

const TodoInput = ({ onAddTask }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('work');
  const [dueDate, setDueDate] = useState('');
  
  const containerRef = useRef(null);

  // Collapse the form if clicked outside, only if fields are empty
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (!title.trim() && !description.trim()) {
          setIsExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [title, description]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate) : null
    });

    // Reset fields
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('work');
    setDueDate('');
    setIsExpanded(false);
  };

  return (
    <div className={`todo-input-container glass-panel ${isExpanded ? 'expanded' : ''}`} ref={containerRef}>
      <form onSubmit={handleSubmit} className="todo-input-form">
        <div className="main-input-row">
          <input
            type="text"
            className="todo-input-field title-input"
            placeholder="Create a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            required
          />
          {!isExpanded && (
            <button 
              type="button" 
              className="btn-expand" 
              onClick={() => setIsExpanded(true)}
              aria-label="Expand form"
            >
              <Plus size={20} />
            </button>
          )}
        </div>

        {isExpanded && (
          <div className="expanded-content-wrapper animate-fade-in">
            <div className="description-input-wrapper">
              <MessageSquare size={16} className="desc-icon" />
              <textarea
                className="description-textarea"
                placeholder="Add notes or description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-meta-row">
              <div className="meta-item">
                <AlertTriangle size={14} className="meta-icon text-yellow" />
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                  className="meta-select"
                >
                  <option value="low">🌱 Low</option>
                  <option value="medium">⚡ Medium</option>
                  <option value="high">🔥 High</option>
                </select>
              </div>

              <div className="meta-item">
                <Tag size={14} className="meta-icon text-purple" />
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="meta-select"
                >
                  <option value="work">💼 Work</option>
                  <option value="personal">🏠 Personal</option>
                  <option value="shopping">🛒 Shopping</option>
                  <option value="health">🏃 Health</option>
                  <option value="ideas">💡 Ideas</option>
                  <option value="other">🏷️ Other</option>
                </select>
              </div>

              <div className="meta-item">
                <Calendar size={14} className="meta-icon text-blue" />
                <input 
                  type="date" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="meta-date-picker"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div className="form-action-row">
              <button 
                type="button" 
                className="btn-secondary btn-cancel" 
                onClick={() => {
                  setTitle('');
                  setDescription('');
                  setIsExpanded(false);
                }}
              >
                <X size={16} />
                Cancel
              </button>

              <button type="submit" className="btn-primary btn-submit">
                <Plus size={16} />
                Add Task
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default TodoInput;