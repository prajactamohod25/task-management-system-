import React, { useState } from 'react';

const emptyTask = {
  title: '',
  description: '',
  priority: 'LOW'
};

export default function TaskForm({ onAdd, isSaving }) {
  const [task, setTask] = useState(emptyTask);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!task.title.trim()) {
      return;
    }

    const wasAdded = await onAdd({
      ...task,
      title: task.title.trim(),
      description: task.description.trim()
    });

    if (wasAdded) {
      setTask(emptyTask);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        value={task.title}
        placeholder="Title"
        onChange={(event) => setTask({ ...task, title: event.target.value })}
      />
      <input
        value={task.description}
        placeholder="Description"
        onChange={(event) => setTask({ ...task, description: event.target.value })}
      />
      <select
        value={task.priority}
        onChange={(event) => setTask({ ...task, priority: event.target.value })}
      >
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
      <button type="submit" disabled={isSaving || !task.title.trim()}>
        {isSaving ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}
