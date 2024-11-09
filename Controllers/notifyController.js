
const Notifications = require('../models/notifications.js')
const Users = require('../models/users.js')

module.exports.addNotificationController = async (req, res) => {
    try {
        const { message, link, toUser } = req.body;

        if (!message || !link || !toUser) {
            return res.status(400).json({
                success: false,
                message: 'field Missing, failed to notify user',
            })
        }


        const user = await Users.findById(toUser);

        const newNofication = new Notifications({
            message,
            link
        })

        user.notifications.unshift(newNofication._id)
        user.save();
        newNofication.save();

        return res.status(200).json({
            success: true,
            message: "User notified"
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: 'failed to notify user',
        })
    }
}

module.exports.updateNotificationController = async (req, res) => {
    try {
      
        const { nid } = req.params;
        await Notifications.findByIdAndUpdate(nid, {
            issNew: false
        })
    } catch (error) {

    }
}