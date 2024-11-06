const express = require('express');
const router = express.Router();

const { verifyToken } = require('../utils/middlewares.js')


const multer = require('multer')
const { storage } = require('../utils/cloudconfig.js');
const upload = multer({ storage })

const { addpostcontroller, getallpostcontroller, likeController, getpostcontroller, saveController, addCommentController, deleteCommentController, updateCommentController, updatePostController, deletePostController } = require('../Controllers/postController')

router.post('/add', verifyToken, upload.single('myfile'), addpostcontroller)
router.get('/allposts', getallpostcontroller)
router.put('/like/:uid/:pid', likeController);
router.put('/save/:uid/:pid', saveController);
router.get('/getpost/:pid', getpostcontroller);
router.post('/comment/add/:pid/:cid', addCommentController);
router.delete('/comment/delete/:pid/:cid', deleteCommentController);
router.put('/comment/edit/:cid', updateCommentController);
// router.purge('/posts/:pid', updatePostControler)
router.put('/edit/:pid', verifyToken, updatePostController);
router.delete('/delete/:pid', verifyToken, deletePostController);

module.exports = router;