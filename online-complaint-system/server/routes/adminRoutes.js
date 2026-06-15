// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers, getAllAgents, getAllComplaints, assignComplaint } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Apply BOTH middlewares to all routes in this file
router.use(authMiddleware, adminMiddleware);

// GET /api/admin/users
router.get('/users', getAllUsers);

// GET /api/admin/agents
router.get('/agents', getAllAgents);

// GET /api/admin/complaints
router.get('/complaints', getAllComplaints);

// POST /api/admin/assign
router.post('/assign', assignComplaint);

module.exports = router;