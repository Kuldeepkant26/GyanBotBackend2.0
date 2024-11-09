const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    issNew: {
        type: Boolean,
        default: true
    },
    link: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Automatically creates `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('Notifications', notificationSchema);
