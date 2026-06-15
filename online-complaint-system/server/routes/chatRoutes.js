// server/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// POST /api/chat/send
router.post('/send', sendMessage);

// GET /api/chat/:complaintId
router.get('/:complaintId', getMessages);

module.exports = router;