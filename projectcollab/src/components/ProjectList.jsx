import React, { useEffect, useState } from 'react';

const ProjectList = ({ token, onSelectProject }) => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:7000/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setProjects(data);
      } else {
        setError(data.error || 'Failed to fetch projects');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await fetch('http://localhost:7000/projects', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (res.ok) {
        setProjects([...projects, data]);
        setTitle('');
        setDescription('');
      } else {
        setError(data.error || 'Failed to create project');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Your Projects</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {projects.map((project) => (
          <li key={project._id} onClick={() => onSelectProject(project)}>
            {project.title}
          </li>
        ))}
      </ul>
      <h3>Create New Project</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <button onClick={handleCreate}>Create Project</button>
    </div>
  );
};

export default ProjectList;
