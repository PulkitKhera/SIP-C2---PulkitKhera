// server/controllers/agentController.js
const AssignedComplaint = require('../models/AssignedComplaint');
const Complaint = require('../models/Complaint');

// 1. Get complaints assigned to this specific agent
exports.getAssignedTasks = async (req, res) => {
    try {
        // Find assignments for this agent and populate the actual complaint details
        const tasks = await AssignedComplaint.find({ agentId: req.user.id })
            .populate('complaintId') 
            .sort({ createdAt: -1 });
            
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error.message);
        res.status(500).json({ message: 'Error fetching assigned tasks' });
    }
};

// 2. Update the status of a complaint
exports.updateComplaintStatus = async (req, res) => {
    try {
        const { assignedComplaintId, newStatus } = req.body;

        // Find the assignment record
        const assignment = await AssignedComplaint.findById(assignedComplaintId);
        if (!assignment || assignment.agentId.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        // Update the assignment status
        assignment.status = newStatus;
        await assignment.save();

        // Update the master complaint status
        await Complaint.findByIdAndUpdate(assignment.complaintId, { status: newStatus });

        res.json({ message: 'Status updated successfully', status: newStatus });
    } catch (error) {
        console.error("Error updating status:", error.message);
        res.status(500).json({ message: 'Error updating complaint status' });
    }
};