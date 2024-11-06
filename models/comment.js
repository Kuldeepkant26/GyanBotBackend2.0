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
    }
});

module.exports = mongoose.model('Comments', commentSchema)