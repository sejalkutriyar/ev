import React, { useEffect, useState } from 'react';

const defaultStatuses = ['To Do', 'In Progress', 'Done'];

const TaskBoard = ({ projectId, token }) => {
  const [tasksByStatus, setTasksByStatus] = useState({});
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`http://localhost:7000/tasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTasksByStatus(data);
      } else {
        setError(data.error || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) {
      setError('Task title is required');
      return;
    }
    try {
      const res = await fetch('http://localhost:7000/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          title: newTaskTitle,
          description: newTaskDescription,
          dueDate: newTaskDueDate,
          status: 'To Do',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskDueDate('');
        fetchTasks();
      } else {
        setError(data.error || 'Failed to create task');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:7000/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchTasks();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update task');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Task Board</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '16px' }}>
        {defaultStatuses.map((status) => (
          <div key={status} style={{ flex: 1, backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '4px' }}>
            <h3>{status}</h3>
            {(tasksByStatus[status] || []).map((task) => (
              <div key={task._id} style={{ backgroundColor: 'white', marginBottom: '8px', padding: '8px', borderRadius: '4px' }}>
                <strong>{task.title}</strong>
                <p>{task.description}</p>
                <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                <div>
                  {defaultStatuses.filter(s => s !== status).map(s => (
                    <button key={s} onClick={() => handleMoveTask(task._id, s)} style={{ marginRight: '4px' }}>
                      Move to {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <h3>Create New Task</h3>
      <input
        type="text"
        placeholder="Title"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Description"
        value={newTaskDescription}
        onChange={(e) => setNewTaskDescription(e.target.value)}
      />
      <br />
      <input
        type="date"
        value={newTaskDueDate}
        onChange={(e) => setNewTaskDueDate(e.target.value)}
      />
      <br />
      <button onClick={handleCreateTask}>Create Task</button>
    </div>
  );
};

export default TaskBoard;