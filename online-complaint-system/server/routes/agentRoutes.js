// server/routes/agentRoutes.js
const express = require('express');
const router = express.Router();
const { getAssignedTasks, updateComplaintStatus } = require('../controllers/agentController');
const authMiddleware = require('../middleware/authMiddleware');
const agentMiddleware = require('../middleware/agentMiddleware');

router.use(authMiddleware, agentMiddleware);

// GET /api/agent/tasks
router.get('/tasks', getAssignedTasks);

// PUT /api/agent/status
router.put('/status', updateComplaintStatus);

module.exports = router;