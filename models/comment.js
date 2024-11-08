const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts"
    },
    value: {
        type: String,
        required: true
    },
    edited: {
        type: Boolean,
        default: false
    },
    uploadingTime: {
        type: String,
        default: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }) // e.g., "19-Jun-2024"
    }
});

module.exports = mongoose.model('Comments', commentSchema);
