/* This middleware varify the json web token. 
*/
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    //Get token.
    const token = req.header('x-auth-token');

    //Check if not token
    if(!token) {
        return res.status(401).json({
                msg: 'No token, authorization denied'
            })
    }
    try {
        //Attach user to ID.
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch(err) {
        res.status(401).json({
            msg: 'Taken is not valid'
        })
    }
}