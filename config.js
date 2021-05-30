'use strict';

/**
 * abstract the parameter origin, at the moment we are using
 * dotenv, should we change the mechanism we chage it here
 */

module.exports = {
    port : process.env.PORT | 3000,
    db: process.env.DB,
    jwt_secret: process.env.JWT_SECRET,
    roles: {
        ADMIN: 'admin',
        USER: 'user'
    },
};