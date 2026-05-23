import React, { useState } from 'react';
import { 
  Pin, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Tag, 
  Plus, 
  Circle, 
  CheckCircle2, 
  AlertTriangle,
  ClipboardList
} from 'lucide-react';
import './TodoItem.css';

const TodoItem = ({ task, onToggleComplete, onTogglePin, onDeleteTask, onUpdateTask }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit Form Fields
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState(task.priority || 'medium');
  const [editCategory, setEditCategory] = useState(task.category || 'work');
  const [editDueDate, setEditDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );
  
  // New Subtask Input
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    
    await onUpdateTask(task._id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      priority: editPriority,
      category: editCategory,
      dueDate: editDueDate ? new Date(editDueDate) : null
    });
    
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDesc(task.description || '');
    setEditPriority(task.priority || 'medium');
    setEditCategory(task.category || 'work');
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setIsEditing(false);
  };

  // Subtask Actions
  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    
    const newSubtask = {
      title: newSubtaskTitle.trim(),
      completed: false
    };
    
    const updatedSubtasks = [...(task.subtasks || []), newSubtask];
    onUpdateTask(task._id, { subtasks: updatedSubtasks });
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (subtaskIndex) => {
    const updatedSubtasks = (task.subtasks || []).map((sub, idx) => 
      idx === subtaskIndex ? { ...sub, completed: !sub.completed } : sub
    );
    onUpdateTask(task._id, { subtasks: updatedSubtasks });
  };

  const handleDeleteSubtask = (subtaskIndex) => {
    const updatedSubtasks = (task.subtasks || []).filter((_, idx) => idx !== subtaskIndex);
    onUpdateTask(task._id, { subtasks: updatedSubtasks });
  };

  // Formatting Due Date helper
  const getDueDateStatus = (dueDateString) => {
    if (!dueDateString) return null;
    const date = new Date(dueDateString);
    const today = new Date();
    
    const dDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const diffTime = dDate - dToday;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { text: 'Today', class: 'due-today' };
    if (diffDays === 1) return { text: 'Tomorrow', class: 'due-tomorrow' };
    if (diffDays < 0) {
      return { 
        text: task.completed ? 'Completed' : 'Overdue', 
        class: task.completed ? 'due-completed' : 'due-overdue' 
      };
    }
    
    return { 
      text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
      class: 'due-upcoming' 
    };
  };

  const dueDateInfo = getDueDateStatus(task.dueDate);

  // Category Icons Mapping
  const categoryDetails = {
    work: { label: 'Work', emoji: '💼' },
    personal: { label: 'Personal', emoji: '🏠' },
    shopping: { label: 'Shopping', emoji: '🛒' },
    health: { label: 'Health', emoji: '🏃' },
    ideas: { label: 'Ideas', emoji: '💡' },
    other: { label: 'Other', emoji: '🏷' }
  };
  
  const currentCategory = categoryDetails[task.category || 'other'] || categoryDetails.other;

  // Subtask completion statistics
  const subtasksCount = task.subtasks?.length || 0;
  const completedSubtasksCount = task.subtasks?.filter(s => s.completed).length || 0;

  return (
    <div className={`todo-item-card-wrapper glass-panel animate-fade-in ${task.completed ? 'completed' : ''} ${task.pinned ? 'pinned' : ''}`}>
      
      {/* Top Main Row */}
      <div className="todo-item-main-row" onClick={() => !isEditing && setIsExpanded(!isExpanded)}>
        
        {/* Checkbox */}
        <button 
          className={`checkbox-btn ${task.completed ? 'checked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(task._id);
          }}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed ? <CheckCircle2 size={20} className="check-icon" /> : <Circle size={20} />}
        </button>

        {/* Title and Category Tag */}
        <div className="todo-item-content">
          {isEditing ? (
            <input
              type="text"
              className="edit-title-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              required
            />
          ) : (
            <div className="title-and-labels">
              <span className="todo-item-title">{task.title}</span>
              {task.pinned && <span className="pinned-badge">Pinned</span>}
            </div>
          )}

          {/* Mini Stats row */}
          {!isEditing && (
            <div className="todo-item-meta-tags">
              {/* Category */}
              <span className="meta-badge category">
                {currentCategory.emoji} {currentCategory.label}
              </span>
              
              {/* Priority */}
              <span className={`meta-badge priority ${task.priority || 'medium'}`}>
                {task.priority === 'high' ? '🔥 High' : task.priority === 'medium' ? '⚡ Med' : '🌱 Low'}
              </span>

              {/* Due Date */}
              {dueDateInfo && (
                <span className={`meta-badge date-badge ${dueDateInfo.class}`}>
                  <Calendar size={11} />
                  {dueDateInfo.text}
                </span>
              )}

              {/* Subtasks Count indicator */}
              {subtasksCount > 0 && (
                <span className="meta-badge subtasks-badge">
                  <ClipboardList size={11} />
                  {completedSubtasksCount}/{subtasksCount}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions Button Panel */}
        <div className="todo-item-actions-panel" onClick={(e) => e.stopPropagation()}>
          
          {/* Star/Pin Button */}
          {!isEditing && (
            <button 
              className={`action-icon-btn pin-btn ${task.pinned ? 'active' : ''}`}
              onClick={() => onTogglePin(task._id)}
              title={task.pinned ? 'Unpin Task' : 'Pin Task'}
            >
              <Pin size={16} />
            </button>
          )}

          {/* Toggle Expand Card */}
          {!isEditing && (
            <button 
              className="action-icon-btn expand-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label="Expand details"
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Description & Subtasks Area */}
      {isExpanded && (
        <div className="todo-item-expanded-panel animate-fade-in">
          
          {isEditing ? (
            /* Editing Form layout */
            <form onSubmit={handleSaveEdit} className="todo-edit-form" onClick={(e) => e.stopPropagation()}>
              <div className="edit-form-group">
                <label>Description / Notes</label>
                <textarea
                  className="edit-desc-textarea"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Task notes..."
                />
              </div>

              <div className="edit-form-grid">
                <div className="edit-form-group">
                  <label>Priority</label>
                  <select 
                    value={editPriority} 
                    onChange={(e) => setEditPriority(e.target.value)}
                  >
                    <option value="low">🌱 Low</option>
                    <option value="medium">⚡ Medium</option>
                    <option value="high">🔥 High</option>
                  </select>
                </div>

                <div className="edit-form-group">
                  <label>Category</label>
                  <select 
                    value={editCategory} 
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    <option value="work">💼 Work</option>
                    <option value="personal">🏠 Personal</option>
                    <option value="shopping">🛒 Shopping</option>
                    <option value="health">🏃 Health</option>
                    <option value="ideas">💡 Ideas</option>
                    <option value="other">🏷️ Other</option>
                  </select>
                </div>

                <div className="edit-form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="edit-actions-row">
                <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                  <X size={14} /> Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Check size={14} /> Save
                </button>
              </div>
            </form>
          ) : (
            /* Display Layout when expanded */
            <div className="expanded-details-wrapper">
              
              {/* Description/Notes */}
              <div className="details-section">
                <h4 className="section-title">Notes</h4>
                <p className="details-description">
                  {task.description ? task.description : <span className="no-desc-text">No notes added.</span>}
                </p>
              </div>

              {/* Subtasks checklist */}
              <div className="details-section">
                <h4 className="section-title">Subtasks Checklist</h4>
                
                {/* Subtask Stats bar */}
                {subtasksCount > 0 && (
                  <div className="subtask-progress-container">
                    <div 
                      className="subtask-progress-bar"
                      style={{ width: `${(completedSubtasksCount / subtasksCount) * 100}%` }}
                    ></div>
                    <span className="subtask-progress-text">
                      {completedSubtasksCount} of {subtasksCount} tasks completed
                    </span>
                  </div>
                )}

                {/* Subtask list */}
                <div className="subtasks-list">
                  {(task.subtasks || []).map((subtask, idx) => (
                    <div key={idx} className={`subtask-item ${subtask.completed ? 'completed' : ''}`}>
                      <button
                        type="button"
                        className={`subtask-checkbox ${subtask.completed ? 'checked' : ''}`}
                        onClick={() => handleToggleSubtask(idx)}
                      >
                        {subtask.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </button>
                      <span className="subtask-title">{subtask.title}</span>
                      <button
                        type="button"
                        className="btn-delete-subtask"
                        onClick={() => handleDeleteSubtask(idx)}
                        title="Delete Subtask"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Subtask Input Form */}
                <form onSubmit={handleAddSubtask} className="add-subtask-form" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    className="subtask-input-field"
                    placeholder="Add a subtask..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  />
                  <button type="submit" className="btn-add-subtask" aria-label="Add subtask">
                    <Plus size={14} />
                  </button>
                </form>
              </div>

              {/* Card Footer Actions (Edit / Delete) */}
              <div className="expanded-footer-actions" onClick={(e) => e.stopPropagation()}>
                <button className="btn-secondary" onClick={() => setIsEditing(true)}>
                  <Edit3 size={14} />
                  Edit Task
                </button>
                <button className="btn-secondary text-danger" onClick={() => onDeleteTask(task._id)}>
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default TodoItem;