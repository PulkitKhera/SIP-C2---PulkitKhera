// server/controllers/chatController.js
const Message = require('../models/Message');

// 1. Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { complaintId, name, message } = req.body;

        const newMessage = new Message({
            complaintId,
            name,
            message
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Chat Error:", error.message);
        res.status(500).json({ message: 'Error sending message' });
    }
};

// 2. Get chat history for a specific complaint
exports.getMessages = async (req, res) => {
    try {
        const { complaintId } = req.params;
        const messages = await Message.find({ complaintId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
};