import React, { useState, useEffect } from 'react';
import TodoInput from './components/TodoInput/TodoInput';
import TodoList from './components/TodoList/TodoList';
import { useTodo } from './context/TodoContext';
import { 
  Sun, 
  Moon, 
  Search, 
  CheckSquare, 
  ListTodo, 
  TrendingUp, 
  Bookmark, 
  Trash2, 
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import './App.css';

const App = () => {
  const { tasks, addTask, toggleComplete, togglePin, deleteTask, updateTask } = useTodo();
  const [theme, setTheme] = useState(localStorage.getItem('todo-theme') || 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Handle Theme switching
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('todo-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const pinnedTasks = tasks.filter(t => t.pinned).length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Normalize category match (fallback to general/other if mismatch)
    const taskCat = task.category || 'other';
    const matchesCategory = categoryFilter === 'all' || taskCat === categoryFilter;
    
    const taskPriority = task.priority || 'medium';
    const matchesPriority = priorityFilter === 'all' || taskPriority === priorityFilter;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Sort tasks: pinned always at top, then sort by selected criteria
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Keep pinned tasks at the top
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });

  // Bulk actions - delete all completed tasks
  const clearCompleted = async () => {
    const completedList = tasks.filter(t => t.completed);
    if (completedList.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete all ${completedList.length} completed tasks?`)) {
      for (const task of completedList) {
        await deleteTask(task._id);
      }
    }
  };

  const categories = [
    { id: 'all', label: 'All Tasks', emoji: '✨' },
    { id: 'work', label: 'Work', emoji: '💼' },
    { id: 'personal', label: 'Personal', emoji: '🏠' },
    { id: 'shopping', label: 'Shopping', emoji: '🛒' },
    { id: 'health', label: 'Health', emoji: '🏃' },
    { id: 'ideas', label: 'Ideas', emoji: '💡' },
    { id: 'other', label: 'Other', emoji: '🏷️' }
  ];

  return (
    <div className="app-main-container animate-fade-in">
      <header className="app-header-container">
        <div className="logo-section">
          <div className="logo-icon">
            <CheckSquare size={24} />
          </div>
          <div className="app-title-wrapper">
            <h1 className="app-title">MERN TaskFlow</h1>
            <p className="app-subtitle">Ultimate Premium Task Planner</p>
          </div>
        </div>

        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Stats Dashboard Panel */}
      <section className="stats-dashboard glass-panel">
        <div className="stats-header">
          <h2 className="stats-title">Progress Tracker</h2>
          <span className="progress-info">{progressPercentage}% Completed</span>
        </div>
        
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper total">
              <ListTodo size={18} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{totalTasks}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper completed">
              <CheckSquare size={18} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{completedTasks}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper active">
              <TrendingUp size={18} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{activeTasks}</span>
              <span className="stat-label">Active</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper pinned">
              <Bookmark size={18} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{pinnedTasks}</span>
              <span className="stat-label">Starred</span>
            </div>
          </div>
        </div>
      </section>

      <main className="app-content">
        {/* Task Creator Form */}
        <TodoInput onAddTask={addTask} />

        {/* Filters and Searching Panel */}
        <section className="filters-container glass-panel">
          <div className="search-row">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search tasks by title or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="dueDate">Sort: Due Date</option>
            </select>
          </div>

          {/* Category Filter Pills */}
          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-pill ${categoryFilter === cat.id ? 'active' : ''}`}
                onClick={() => setCategoryFilter(cat.id)}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Priority & Bulk actions row */}
          <div className="filter-dropdowns-row">
            <div className="dropdown-filter-group">
              <SlidersHorizontal size={14} />
              <span>Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">🔥 High</option>
                <option value="medium">⚡ Medium</option>
                <option value="low">🌱 Low</option>
              </select>
            </div>

            {completedTasks > 0 && (
              <button 
                className="btn-secondary" 
                style={{ marginLeft: 'auto', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', color: 'var(--danger-color)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                onClick={clearCompleted}
              >
                <Trash2 size={14} />
                Clear Completed
              </button>
            )}
          </div>
        </section>

        {/* Task List Component */}
        <TodoList 
          tasks={sortedTasks} 
          onToggleComplete={toggleComplete} 
          onTogglePin={togglePin}
          onDeleteTask={deleteTask} 
          onUpdateTask={updateTask}
        />
      </main>
    </div>
  );
};

export default App;