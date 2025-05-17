import express from 'express';
import Project from '../models/Project.js';
import User from '../models/User.js';
import admin from 'firebase-admin';

const router = express.Router();


async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

router.use(verifyToken);


import mongoose from 'mongoose';

async function checkProjectMember(req, res, next) {
  const userId = req.user._id.toString();
  const projectId = req.params.projectId || req.body.projectId;

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


router.post('/', async (req, res) => {
  const { title, description, members } = req.body;
  const userId = req.user._id;

  try {
    const project = new Project({
      title,
      description,
owner: new mongoose.Types.ObjectId(userId),
members: (members || []).map(id => new mongoose.Types.ObjectId(id)),
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.post('/:projectId/invite', checkProjectMember, async (req, res) => {
  const { email } = req.body;
  const project = req.project;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!project.members.includes(user._id)) {
      project.members.push(user._id);
      await project.save();
    }
    res.json({ message: 'User invited successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to invite user' });
  }
});


router.get('/', async (req, res) => {
  const userId = req.user._id;
  try {
    const projects = await Project.find({
$or: [{ owner: new mongoose.Types.ObjectId(userId) }, { members: new mongoose.Types.ObjectId(userId) }],
    });
    res.json(projects);
  } catch (error) {
    console.error('Fetch projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

export default router;