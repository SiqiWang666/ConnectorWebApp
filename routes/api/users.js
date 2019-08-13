const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');
const User = require('../../models/User');

// @route     POST api/users
// @desc      Register Users
// @access    Public
router.post('/',
[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 })
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const {name, email, password} = req.body;
    try {
        //Check if the user exist.
        let user = await User.findOne( { email });
        if(user) {
            return res.status(400).json({
                erros: [ {msg: "User already exist"} ]
            });
        }
        //Get users gravatar.
        /* Avatar:
            size: 200px * 200px
            rating: may contain rude gestures, provocatively dressed individuals, the lesser swear words, or mild violence.
            default: default image
        */
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })
        //Encrypt password.
        const salt = await bcrypt.genSalt(10); 
        user.password = await bcrypt.hash(password, salt);
        //Save the user into database.
        await user.save();

        //Create jsonwebtoken.
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: "2 days" },
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;