import React, { useEffect, useMemo, useState } from 'react';
import { createTask, getApiErrorMessage, getTasks, moveTask } from '../api';
import TaskForm from './TaskForm';

const columns = [
  { id: 'TASK', label: 'To do' },
  { id: 'IN_PROGRESS', label: 'In progress' },
  { id: 'COMPLETED', label: 'Completed' }
];

const formatDuration = (seconds) => {
  if (seconds == null) {
    return null;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
};

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    setError('');
    try {
      setTasks(await getTasks());
    } catch (err) {
      setError(`Could not load tasks: ${getApiErrorMessage(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const tasksByStatus = useMemo(
    () =>
      columns.reduce((grouped, column) => {
        grouped[column.id] = tasks.filter((task) => task.status === column.id);
        return grouped;
      }, {}),
    [tasks]
  );

  const addTask = async (task) => {
    setIsSaving(true);
    setError('');
    try {
      await createTask(task);
      await loadTasks();
      return true;
    } catch (err) {
      setError(`Could not add task: ${getApiErrorMessage(err)}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const move = async (id, status) => {
    if (!id) {
      return;
    }

    setError('');
    try {
      await moveTask(id, status);
      await loadTasks();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1>Task Management</h1>
          <p>Drag tasks from left to right as work starts and finishes.</p>
        </div>
        <button className="secondary-button" type="button" onClick={loadTasks}>
          Refresh
        </button>
      </header>

      <TaskForm onAdd={addTask} isSaving={isSaving} />

      {error && <div className="error-banner">{error}</div>}
      {isLoading && <div className="status-message">Loading tasks...</div>}

      <section className="board" aria-label="Task board">
        {columns.map((column) => (
          <div
            className="column"
            key={column.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => move(event.dataTransfer.getData('taskId'), column.id)}
          >
            <div className="column-header">
              <h2>{column.label}</h2>
              <span>{tasksByStatus[column.id]?.length || 0}</span>
            </div>

            <div className="task-list">
              {(tasksByStatus[column.id] || []).map((task) => (
                <article
                  className="task-card"
                  draggable
                  key={task.id}
                  onDragStart={(event) => event.dataTransfer.setData('taskId', task.id)}
                >
                  <div className="task-card-header">
                    <h3>{task.title}</h3>
                    <span className={`priority priority-${task.priority?.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && <p>{task.description}</p>}
                  {task.totalSeconds != null && (
                    <div className="duration">Completed in {formatDuration(task.totalSeconds)}</div>
                  )}
                </article>
              ))}

              {(tasksByStatus[column.id] || []).length === 0 && (
                <div className="empty-column">Drop tasks here</div>
              )}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
