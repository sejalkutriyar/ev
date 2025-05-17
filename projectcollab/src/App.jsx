import { useState } from 'react';
import './App.css';
import Auth from './components/Auth.jsx';
import ProjectList from './components/ProjectList.jsx';
import TaskBoard from './components/TaskBoard.jsx';
import AutomationManager from './components/AutomationManager.jsx';
import NotificationList from './components/NotificationList.jsx';
import { auth } from './firebase';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleLogin = async (userData) => {
    setUser(userData.backendUser);
    const idToken = await userData.firebaseUser.getIdToken();
    setToken(idToken);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setToken(null);
      setSelectedProject(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      <h1>Welcome, {user.name}</h1>
      <p>Your email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
      <ProjectList user={user} token={token} onSelectProject={setSelectedProject} />
      {selectedProject && (
        <>
          <TaskBoard projectId={selectedProject._id} token={token} />
          <AutomationManager projectId={selectedProject._id} token={token} />
        </>
      )}
      <NotificationList userId={user._id} token={token} />
    </div>
  );
}

export default App;
