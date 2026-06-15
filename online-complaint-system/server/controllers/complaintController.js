// server/controllers/complaintController.js
const Complaint = require('../models/Complaint');

// 1. Lodge a new complaint
exports.lodgeComplaint = async (req, res) => {
    try {
        const { name, address, city, state, pincode, comment } = req.body;

        // Create new complaint, automatically assigning the logged-in user's ID
        const newComplaint = new Complaint({
            userId: req.user.id, 
            name,
            address,
            city,
            state,
            pincode,
            comment,
            status: 'Pending' // Default status
        });

        const savedComplaint = await newComplaint.save();
        res.status(201).json({ message: 'Complaint lodged successfully', complaint: savedComplaint });

    } catch (error) {
        console.error("Error lodging complaint:", error.message);
        res.status(500).json({ message: 'Server error while lodging complaint' });
    }
};

// 2. Get complaints for the logged-in User
exports.getUserComplaints = async (req, res) => {
    try {
        // Find all complaints where the userId matches the currently logged-in user
        const complaints = await Complaint.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        console.error("Error fetching complaints:", error.message);
        res.status(500).json({ message: 'Server error while fetching complaints' });
    }
};