const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comments"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }


});

module.exports = mongoose.model('Posts', postSchema);