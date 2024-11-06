const Users = require('../models/users');
const bcrypt = require('bcrypt');
const { populate } = require('dotenv');
const jwt = require('jsonwebtoken');

const { cloudinary } = require('../utils/cloudconfig.js');

module.exports.Signupcontroller = async (req, res) => {
    const { name, email, password, grade } = req.body;

    if (!name || !email || !password || !grade) {
        return res.status(400).json({
            success: false,
            message: "Somthing missing"
        })
    }

    let checkUser = await Users.findOne({ email });
    if (checkUser) {
        return res.status(400).json({
            success: false,
            message: "Email already ragistered"
        })
    }

    let salt = await bcrypt.genSalt(10)
    let encrypt = await bcrypt.hash(password, salt)

    let newUser = new Users({
        name,
        email,
        grade,
        password: encrypt
    });

    await newUser.save()

    newUser.password = '';
    const user = newUser

    let token = jwt.sign({ user }, process.env.JWT_SECRET);

    return res.status(200).json({
        success: true,
        message: "Signup Successfully",
        user: newUser,
        token
    })
}


module.exports.Logincontroller = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Somthing missing"
        })
    }

    let user = await Users.findOne({ email });
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Email not ragistered"
        })
    }

    let compare = await bcrypt.compare(password, user.password);
    if (!compare) {
        return res.status(400).json({
            success: false,
            message: "Incorrect password"
        })
    }

    user.password = '';

    let token = jwt.sign({ user }, process.env.JWT_SECRET);


    return res.status(200).json({
        success: true,
        message: "Login Successfully",
        user,
        token
    })

}


module.exports.GetUserController = async (req, res) => {
    try {
        // Example logic (replace with your actual implementation)
        res.status(200).json({
            success: true,
            message: "User fetched",
            user: req.user
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching user",
            error: error.message
        });
    }
}

module.exports.GetUserControllerB = async (req, res) => {
    try {

        const user = await Users.findById(req.params.uid)
            .populate({
                path: 'savedPosts',
                populate: [
                    {
                        path: 'owner'
                    },
                    {
                        path: 'likes'
                    }
                ]
            }).populate('followers').populate('following');
        res.status(200).json({
            success: true,
            message: "User fetched",
            user
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching user",
            error: error.message
        });
    }
}

module.exports.followController = async (req, res) => {
    const { u1id, u2id } = req.params;

    try {
        const user1 = await Users.findById(u1id);
        const user2 = await Users.findById(u2id);

        if (!user1 || !user2) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFollowing = user1.following.includes(u2id);

        if (isFollowing) {
            // Unfollow user2
            user1.following = user1.following.filter(id => id.toString() !== u2id);
            user2.followers = user2.followers.filter(id => id.toString() !== u1id);

            await user1.save();
            await user2.save();

            return res.status(200).json({ message: 'Unfollowed successfully' });
        } else {
            // Follow user2
            user1.following.push(u2id);
            user2.followers.push(u1id);

            await user1.save();
            await user2.save();

            return res.status(200).json({ message: 'Followed successfully' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports.updateProfileController = async (req, res) => {
    try {
        // Ensure that a file was uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const fileUrl = req.file.path;  // URL of the uploaded file
        const user = await Users.findById(req.user._id);

        // If there is an existing profile picture, delete it from Cloudinary
        if (user.profilePicture && user.profilePicture !== 'https://cdn-icons-png.flaticon.com/256/3237/3237476.png') {
            // Extract the public ID from the existing URL
            const regex = /Gyan-bot\/([^\/]+)\.[^\/]+$/;
            const match = user.profilePicture.match(regex);
            const publicId = match ? `Gyan-bot/${match[1]}` : null;

            // Log for debugging
            console.log('Extracted Public ID:', publicId);

            // Delete the old image if publicId is valid
            if (publicId) {
                await cloudinary.uploader.destroy(publicId, function (error, result) {
                    if (error) {
                        console.error('Error deleting old image:', error);
                    } else {
                        console.log('Old image deleted:', result);
                    }
                });
            }
        }

        // Update user profile picture URL
        user.profilePicture = fileUrl;
        await user.save();
        return res.status(200).json({ success: true, message: "Profile updated" });
    } catch (error) {
        console.error('Error in updating profile:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports.updateUserInfoController = async (req, res) => {
    try {
        const { bio, name, grade } = req.body;
        await Users.findByIdAndUpdate(req.user._id, {
            bio, name, grade
        })

        res.status(200).json({ success: true, message: "info updated" })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'fail to update info' });
    }
}


