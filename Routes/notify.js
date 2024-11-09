const express = require('express');

const router = express.Router();

const { addNotificationController, updateNotificationController } = require('../Controllers/notifyController')

router.post('/add', addNotificationController)
router.put('/notnew/:nid', updateNotificationController)

module.exports = router