import admin from 'firebase-admin';
import User from '../models/User.js';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      user = new User({
        firebaseUid: decodedToken.uid,
        name: decodedToken.name || '',
        email: decodedToken.email || '',
      });
      await user.save();
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
