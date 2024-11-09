const Users = require('../models/users');

const jwt = require('jsonwebtoken');

module.exports.verifyToken = async (req, res, next) => {
    try {
        // Ensure the authorization header is present
        if (!req.headers.authorization) {
            return res.status(401).json({
                success: false,
                message: "Authorization header is missing"
            });
        }

        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await Users.findOne({ _id: decode.user._id }).populate('notifications')
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.password = '';
        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            error: error.message
        });
    }
};
