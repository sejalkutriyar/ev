import express from 'express';
import admin from 'firebase-admin';
import User from '../models/User.js';

const router = express.Router();

async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    console.error('No token provided in Authorization header');
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Invalid token error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

router.post('/login', async (req, res) => {
  console.log('Login request received with body:', req.body);
  const { idToken } = req.body;
  if (!idToken) {
    console.error('ID token missing in request body');
    return res.status(400).json({ error: 'ID token is required' });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('Decoded Token:', decodedToken); 
    const { uid, name, email } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = new User({
        firebaseUid: uid,
        name: name || 'No Name',
        email,
      });
      await user.save();
      console.log('New user created:', user);
    } else {
      console.log('Existing user found:', user);
    }
    res.json({ user });
  } catch (error) {
    console.error('Token verification error:', error); 
    res.status(401).json({ error: 'Invalid ID token' });
  }
});

export default router;
