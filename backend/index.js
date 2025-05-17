import express from 'express';
import mongoose from 'mongoose';
import admin from 'firebase-admin';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.join(__dirname, 'tracker-43751-firebase-adminsdk-fbsvc-9a7c37070e.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://seju020322:fCaygLl8yN2LlNXO@cluster0.pplw5uh.mongodb.net/taskBoard';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

import { authenticateToken } from './middleware/auth.js';

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


app.use((req, res, next) => {
  if (req.path.startsWith('/auth')) {
    return next();
  }
  return authenticateToken(req, res, next);
});


import authRoutes from './routes/auth.js';
import projectRoutes from './routes/project.js';
import taskRoutes from './routes/task.js';
import automationRoutes from './routes/automation.js';
import notificationRoutes from './routes/notification.js';
import mailRoutes from './routes/mail.js';


app.use('/auth', authRoutes);
app.use('/project', projectRoutes);
app.use('/task', taskRoutes);
app.use('/automation', automationRoutes);
app.use('/notification', notificationRoutes);
app.use('/mail', mailRoutes);


app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.get('/', (req, res) => {
  res.send('Project Collaboration Backend is running');
});


const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
