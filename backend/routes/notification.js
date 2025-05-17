
import express from 'express';
import Notification from '../models/Notification.js';
import Project from '../models/Project.js';

const router = express.Router();

// Middleware to check if user is a project member
async function checkProjectMember(req, res, next) {
  const userId = req.user._id.toString();
  const projectId = req.body.projectId || req.params.projectId;

  if (!projectId) {
    return res.status(400).json({ error: 'Project ID is required' });
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const isMember = project.members.some(memberId => memberId.toString() === userId) || project.owner.toString() === userId;
  if (!isMember) {
    return res.status(403).json({ error: 'Access denied: Not a project member' });
  }

  req.project = project;
  next();
}

// Create a new notification
router.post('/', checkProjectMember, async (req, res) => {
  const { user, projectId, message } = req.body;

  try {
    const notification = new Notification({
      user,
      project: projectId,
      message,
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Get notifications for a user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ user: userId });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

export default router;