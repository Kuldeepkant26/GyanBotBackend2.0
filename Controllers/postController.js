const Posts = require('../models/posts');
const users = require('../models/users');
const Comments = require('../models/comment')

const { cloudinary } = require('../utils/cloudconfig.js');

module.exports.addpostcontroller = async (req, res) => {

    try {
        const fileUrl = req.file.path;  // URL of the uploaded file
        const user = await users.findById(req.user._id)

        const { title, description } = req.body;
        if (!title || !fileUrl || !description) {
            return res.status(400).json({
                success: false,
                message: "Missing field"
            })
        }
        const newPost = new Posts({
            title,
            description,
            picture: fileUrl,
            owner: req.user._id
        });
        user.userPosts.push(newPost._id);
        await user.save();
        await newPost.save();

        return res.status(200).json({
            success: true,
            message: "Post uploaded"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to upload post"
        })
    }
}


module.exports.getallpostcontroller = async (req, res) => {
    try {
        const posts = await Posts.find().populate({ path: 'owner' }).populate({ path: 'likes' });
        if (!posts) {
            return res.status(400).json({
                success: false,
                message: "Failed to fetch posts"
            });
        }

        return res.status(200).json({
            success: true,
            message: "all posts fetched",
            posts
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Unable to fetch posts"
        })
    }

}

module.exports.likeController = async (req, res) => {
    try {
        const { uid, pid } = req.params;
        const user = await users.findById(uid);
        const post = await Posts.findById(pid);

        // Check if the post is already liked by the user
        if (user.likedPosts.includes(pid)) {
            // Unlike: Remove post ID from user's likedPosts and user ID from post's likes
            user.likedPosts = user.likedPosts.filter(postId => postId.toString() !== pid);
            post.likes = post.likes.filter(userId => userId.toString() !== uid);
            await user.save();
            await post.save();

            return res.status(200).json({
                success: true,
                message: "Unliked successfully",
                post
            });
        } else {
            // Like: Add post ID to user's likedPosts and user ID to post's likes
            user.likedPosts.push(pid);
            post.likes.push(uid);
            await user.save();
            await post.save();

            return res.status(200).json({
                success: true,
                message: "Liked successfully",
                post

            });
        }
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "An error occurred"
        });
    }
};
module.exports.saveController = async (req, res) => {
    try {
        const { uid, pid } = req.params;
        const user = await users.findById(uid);
        const post = await Posts.findById(pid);

        // Check if the post is already liked by the user
        if (user.savedPosts.includes(pid)) {
            // Unlike: Remove post ID from user's likedPosts and user ID from post's likes
            user.savedPosts = user.savedPosts.filter(postId => postId.toString() !== pid);

            await user.save();
            await post.save();

            return res.status(200).json({
                success: true,
                message: "removed from saved",
                post
            });
        } else {
            // Like: Add post ID to user's likedPosts and user ID to post's likes
            user.savedPosts.push(pid);

            await user.save();

            return res.status(200).json({
                success: true,
                message: "Saved successfully",
                post

            });
        }
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error in saving"
        });
    }
};

module.exports.getpostcontroller = async (req, res) => {
    try {

        const { pid } = req.params;

        const post = await Posts.findById(pid).populate({ path: 'owner' }).populate({ path: 'likes' }).populate({ path: 'comments', populate: 'owner' });

        return res.status(200).json({
            success: true,
            message: "Data fetched",
            post
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "error in fetching post"
        });
    }
}

module.exports.addCommentController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const { comment } = req.body;


        // const user = await users.findById(cid);
        const post = await Posts.findById(pid);
        let newComment = new Comments({
            owner: cid,
            post: pid,
            value: comment
        })

        post.comments.push(newComment._id);
        await post.save()
        await newComment.save()
        return res.status(200).json({
            success: true,
            message: "Comment added",

        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to add comment"
        })
    }


}

module.exports.deleteCommentController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const post = await Posts.findById(pid);
        post.comments = post.comments.filter(commentId => commentId.toString() !== cid);
        await Comments.findByIdAndDelete(cid);
        await post.save();

        return res.status(200).json({
            success: true,
            message: "Comment deleted"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to delete comment"
        })
    }
}

module.exports.updateCommentController = async (req, res) => {
    try {
        const { cid } = req.params;
        const { newComment } = req.body;
        await Comments.findByIdAndUpdate(cid, { value: newComment });
        return res.status(200).json({
            success: true,
            message: "Changes saved"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to delete comment"
        })
    }
}

module.exports.updatePostController = async (req, res) => {
    try {

        const { pid } = req.params;

        const { postEditTitle, posEditDescription } = req.body;

        await Posts.findByIdAndUpdate(pid, {
            title: postEditTitle,
            description: posEditDescription
        })

        return res.status(200).json({
            success: true,
            message: "Post Updated"
        })


    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to update post"
        })
    }


}


module.exports.deletePostController = async (req, res) => {
    try {
        const { pid } = req.params;

        // Find the post by ID
        const post = await Posts.findById(pid);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Handle image deletion from Cloudinary
        if (post.picture) {
            const regex = /Gyan-bot\/([^\/]+)\.[^\/]+$/;
            const match = post.picture.match(regex);
            const publicId = match ? `Gyan-bot/${match[1]}` : null;

            if (publicId) {
                await cloudinary.uploader.destroy(publicId, (error, result) => {
                    if (error) {
                        console.error('Error deleting old image:', error);
                    } else {
                        console.log('Old image deleted:', result);
                    }
                });
            }
        }

        // Remove post ID from user's `userPosts` array
        await users.updateOne(
            { _id: req.user._id },
            { $pull: { userPosts: pid } }
        );

        // Delete related comments associated with the post
        await Comments.deleteMany({ post: pid });

        // Delete the post
        await Posts.findByIdAndDelete(pid);

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });

    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete post"
        });
    }
};