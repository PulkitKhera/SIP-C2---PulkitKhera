// server/routes/complaintRoutes.js
const express = require('express');
const router = express.Router();
const { lodgeComplaint, getUserComplaints } = require('../controllers/complaintController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/complaints -> Lodge a complaint (Protected)
router.post('/', authMiddleware, lodgeComplaint);

// GET /api/complaints/my-complaints -> Get user's complaints (Protected)
router.get('/my-complaints', authMiddleware, getUserComplaints);

module.exports = router;