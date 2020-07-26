// Imports
var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = process.env.JWT_SIGN_TOKEN || 'f9bf78b9a18ce6d46a0cd2b0b86df9da';

// Exported functions
module.exports = {
    generateTokenForUser: function (userData) {
        return jwt.sign({
            userId: userData.id,
            email: userData.email
        },
            JWT_SIGN_SECRET,
            {
                expiresIn: '2h'
            })
    },
    parseAuthorization: function (authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    getUserId: function (authorization) {
        var userId = -1;
        var token = module.exports.parseAuthorization(authorization);
        if (token != null) {
            try {
                var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if (jwtToken != null)
                    userId = jwtToken.userId;
            } catch (err) { }
        }
        return userId;
    }
}