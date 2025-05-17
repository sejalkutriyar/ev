import express from 'express';
import Automation from '../models/Automation.js';
import Project from '../models/Project.js';
import { sendMail } from '../utils/mail.js';

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

// Create a new automation
router.post('/', checkProjectMember, async (req, res) => {
  const { projectId, trigger, action, parameters } = req.body;

  try {
    if (action.toLowerCase() === 'send mail' || action.toLowerCase() === 'send email') {
      const { to, subject, text, html } = parameters.parameters || {};
      if (!to || !subject || (!text && !html)) {
        return res.status(400).json({ error: 'Missing email parameters: to, subject, and text or html' });
      }
      await sendMail({ to, subject, text, html });
    }

    const automation = new Automation({
      project: projectId,
      trigger,
      action,
      parameters,
    });
    await automation.save();
    res.status(201).json(automation);
  } catch (error) {
    console.error('Failed to create automation:', error);
    res.status(500).json({ error: 'Failed to create automation' });
  }
});

// Get automations for a project
router.get('/project/:projectId', checkProjectMember, async (req, res) => {
  const { projectId } = req.params;

  try {
    const automations = await Automation.find({ project: projectId });
    res.json(automations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch automations' });
  }
});

export default router;