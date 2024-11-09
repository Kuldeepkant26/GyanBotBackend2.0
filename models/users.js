const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },

    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Posts"
        }
    ],
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notifications"
        }
    ],
    userPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Posts"
        }
    ],
    savedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Posts"
        }
    ],
    profilePicture: {
        type: String,
        required: false,
        default: null
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        }
    ]


});

module.exports = mongoose.model('Users', userSchema);