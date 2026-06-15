// server/controllers/adminController.js
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const AssignedComplaint = require('../models/AssignedComplaint');

// 1. Get all ordinary users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'Ordinary' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// 2. Get all agents
exports.getAllAgents = async (req, res) => {
    try {
        const agents = await User.find({ role: 'Agent' }).select('-password');
        res.json(agents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching agents' });
    }
};

// 3. Get all complaints across the platform
exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching complaints' });
    }
};

// 4. Assign a complaint to an agent
exports.assignComplaint = async (req, res) => {
    try {
        const { complaintId, agentId } = req.body;

        // Verify both the complaint and the agent exist
        const complaint = await Complaint.findById(complaintId);
        const agent = await User.findById(agentId);

        if (!complaint || !agent || agent.role !== 'Agent') {
            return res.status(400).json({ message: 'Invalid complaint or agent ID' });
        }

        // Create the new assignment record
        const newAssignment = new AssignedComplaint({
            agentId: agent._id,
            complaintId: complaint._id,
            status: 'Assigned',
            agentName: agent.name
        });

        await newAssignment.save();

        // Update the original complaint's status
        complaint.status = 'Assigned';
        await complaint.save();

        res.status(200).json({ message: 'Complaint assigned successfully', assignment: newAssignment });

    } catch (error) {
        console.error("Assignment Error:", error.message);
        res.status(500).json({ message: 'Server error while assigning complaint' });
    }
};