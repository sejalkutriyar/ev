import React, { useEffect, useState } from 'react';

const AutomationManager = ({ projectId, token }) => {
  const [automations, setAutomations] = useState([]);
  const [trigger, setTrigger] = useState('');
  const [action, setAction] = useState('');
  const [parameters, setParameters] = useState('');
  const [error, setError] = useState(null);

  const fetchAutomations = async () => {
    try {
      const res = await fetch(`http://localhost:7000/automations/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAutomations(data);
      } else {
        setError(data.error || 'Failed to fetch automations');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchAutomations();
    }
  }, [projectId]);

 const handleCreateAutomation = async () => {
  try {
    let parsedParameters = {};
    if (parameters) {
      try {
        parsedParameters = JSON.parse(parameters);
      } catch (e) {
        setError('Parameters must be a valid JSON string');
        return;
      }
    }
    const body = {
      projectId,
      trigger,
      action,
      parameters: { parameters: parsedParameters },
    };
    const res = await fetch('http://localhost:7000/automations', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) {
      setTrigger('');
      setAction('');
      setParameters('');
      fetchAutomations();
    } else {
      setError(data.error || 'Failed to create automation');
    }
  } catch (err) {
    setError(err.message);
  }
};

  
  return (
    <div>
      <h2>Automation Manager</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {automations.map((auto) => (
          <li key={auto._id}>
            Trigger: {auto.trigger}, Action: {auto.action}, Parameters: {auto.parameters}
          </li>
        ))}
      </ul>
      <h3>Create New Automation</h3>
      <input
        type="text"
        placeholder="Trigger"
        value={trigger}
        onChange={(e) => setTrigger(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Action"
        value={action}
        onChange={(e) => setAction(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Parameters (JSON string)"
        value={parameters}
        onChange={(e) => setParameters(e.target.value)}
      />
      <br />
      <button onClick={handleCreateAutomation}>Create Automation</button>
    </div>
  );
};

export default AutomationManager;