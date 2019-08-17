const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const User = require('../../models/User');

// @route     POST api/posts
// @desc      Create a post.
// @access    Private
router.post('/',
    [auth, [
        check('text', 'Text is required').not().isEmpty()
    ]],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status*=(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post ({
                text: req.body.text,
                user: req.user.id,
                name: user.name,
                avatar: user.avatar
            })

            const post = await newPost.save();

            res.json(post);
        }catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
 );

// @route     GET api/posts
// @desc      Get all posts.
// @access    Private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route     GET api/posts/:id
// @desc      Get post by ID.
// @access    Private
router.get('/:id', auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({ msg: 'Post not found'});
        }
        res.json(post);
    }catch(err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found'});
        }
        res.status(500).send('Server Error');
    }
});

// @route     DELETE api/posts/:id
// @desc      Delete a post by ID.
// @access    Private
router.delete('/:id', auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({ msg: 'Post not found'});
        }
        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized'});
        }
        await post.remove();
        res.json({ msg: 'Post removed'});
    }catch(err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found'});
        }
        res.status(500).send('Server Error');
    }
});

// @route     PUT api/posts/like/:id
// @desc      Like a post.
// @access    Private
router.put('/like/:id', auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        //Check if the user have already like the post.
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked.'});
        }
        //Append the user to beginning of the array.
        post.likes.unshift({ user: req.user.id });

        await post.save();
        res.json(post.likes);
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route     PUT api/posts/unlike/:id
// @desc      Unlike a post.
// @access    Private
router.put('/unlike/:id', auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        //Check if the post has been liked by the user.
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not yet been liked'});
        }
        //Remove user from the array.
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);
        await post.save();
        res.json(post.likes);
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route     POST api/posts/comment/:id
// @desc      Comment on a post.
// @access    Private
router.post('/comment/:id',
    [auth, [
        check('text', 'Text is required.').not().isEmpty()
    ]],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try{
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.id);

            const newComment = {
                text: req.body.text,
                user: req.user.id,
                name: user.name,
                avatar: user.avatar
            };

            post.comments.unshift(newComment);
            await post.save();

            res.json(post.comments);
        }catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
)

// @route     DELETE api/posts/comment/:id/:comment_id
// @desc      Delete a comment.
// @access    Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //Filter the comment by comment_id.
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        if(!comment) {
            return res.status(404).json({ msg: 'Comment does not exist.'});
        }
        
        //Check if the user owns the comment.
        if(comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized.' });
        }

        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.params.comment_id);
        post.comments.splice(removeIndex, 1);
        await post.save();
        res.json(post.comments);
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;