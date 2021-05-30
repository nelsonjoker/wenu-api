const jwt = require('jsonwebtoken');
const { jwt_secret: secret } = require('../../config');
const UserModel = require('../../user/model/user.model');


//TODO: check if user exists in db, instead of using JWT only

/**
 * middleware for authentication and autorization of a given request
 * the incoming request is expected to have a JWT
 * @param {string} role role required to be authorized
 * @returns 
 */
function authorize(role = '') {

    return [
        // authenticate JWT token and attach account to request object (req.acc)
        (req, res, next) => {
            const authHeader = req.headers.authorization;
        
            if (authHeader) {
                const token = authHeader.split(' ')[1];
        
                jwt.verify(token, secret, async (err, acc) => {
                    if (err || !acc) {
                        return res.sendStatus(403);
                    }
                    req.acc = acc;
                    next();
                });

            } else {
                res.sendStatus(401);
            }
        },

        // authorize based on user role
        async (req, res, next) => {



            if(!req.acc.roles.includes(role)){
                // account no longer exists or role not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            next();
        }
    ];
}



module.exports = authorize;