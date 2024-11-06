const express = require('express');

const router = express.Router();

const { verifyToken } = require('../utils/middlewares.js')


const multer = require('multer')
const { storage } = require('../utils/cloudconfig.js');
const upload = multer({ storage })


const { Signupcontroller, Logincontroller, GetUserController, GetUserControllerB, followController, updateProfileController, updateUserInfoController } = require('../Controllers/authController');

router.post('/signup', Signupcontroller);
router.post('/login', Logincontroller);
router.get('/getuser', verifyToken, GetUserController);
router.get('/getuser/:uid', GetUserControllerB);
router.put('/follow/:u1id/:u2id', followController);
router.post('/updateprofile', verifyToken, upload.single('myfile'), updateProfileController)
router.put('/update/userinfo', verifyToken, updateUserInfoController)

module.exports = router;