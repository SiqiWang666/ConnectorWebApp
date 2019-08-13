//Handle Jason web taken authe ntication
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('config');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @route     GET api/auth
// @desc      Authenticate json web token.
// @access    Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route     POST api/auth
// @desc      Authenticate user & get token
// @access    Public
router.post(
    '/',
    [
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const {email, password} = req.body;
        try{
            let user = await User.findOne({ email });
            if(!user) {
                return res.status(400).json ({
                    errors: [{msg: "Invalid Credentials"}]
                })
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if(!isPasswordMatch){
                return res.status(400).json ({
                    errors: [{msg: "Invalid Credentials"}]
                })
            }
            //Create json webtoken.
            const payload = {
                user: {
                    id: user.id
                }
            }
    
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if(err) throw err;
                    res.json({ token });
                }
            );
        }catch(err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
)
module.exports = router;