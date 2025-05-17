import express from 'express';
import Task from '../models/Task.js';
import Project from '../models/Project.js';

const router = express.Router();

async function checkProjectMember(req, res, next) {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
  }
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

router.post('/', checkProjectMember, async (req, res) => {
  const { projectId, title, description, dueDate, assignee, status } = req.body;

  try {
    const task = new Task({
      project: projectId,
      title,
      description,
      dueDate,
      assignee,
      status: status || 'To Do',
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.put('/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const updates = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const project = await Project.findById(task.project);
    const userId = req.user._id.toString();
    const isMember = project.members.some(memberId => memberId.toString() === userId) || project.owner.toString() === userId;
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied: Not a project member' });
    }

    Object.assign(task, updates);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

router.get('/project/:projectId', checkProjectMember, async (req, res) => {
  const { projectId } = req.params;

  try {
    const tasks = await Task.find({ project: projectId });
    const grouped = tasks.reduce((acc, task) => {
      acc[task.status] = acc[task.status] || [];
      acc[task.status].push(task);
      return acc;
    }, {});
    res.json(grouped);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

export default router;
