const jwt = require('jsonwebtoken');
const Joi = require('joi');
const AccountModel = require('../model/account.model'),
    RefreshTokenModel = require('../model/refresh-token.model');

const {jwt_secret, roles} = require('../../config');
const crypto = require('crypto');



function generateJwtToken(account) {
    // create a jwt token containing the account id that expires in 15 minutes
    return jwt.sign({ sub: account.id, id: account.id, roles: account.roles.join(',') }, jwt_secret, { expiresIn: '15m' });
}

function generateRefreshToken(account, ipAddress) {
    // create a refresh token that expires in 7 days
    return new RefreshTokenModel({
        account: account.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createdByIp: ipAddress
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

module.exports = {
    register : async (req, res) => {
        const schema = Joi.object({
            name: Joi.string(),
            email: Joi.string().email().required(),
            password : Joi.string().required().min(4),
            repeat_password: Joi.ref('password')
        });

        let {value: userData, error} = schema.validate(req.body);
        if(error){
            return next(error);            
            //return res.status(403).send({message: error.message});
        }

        userData = { ...userData, ...{roles: [roles.USER]} };
        delete userData.repeat_password;

        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(userData.password).digest("base64");
        userData.password = salt + "$" + hash;

        let acc = new AccountModel(userData);
        acc = await acc.save();
        res.json(acc.toJSON());

    },
    login : async (req, res, next) => {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password : Joi.string().required().min(4),
        });

        let {value, error} = schema.validate(req.body);
        if(error){
            return next(error);            
        }

        const acc = await AccountModel.findByEmail(value.email);
        if (acc) {

            let passwordFields = acc.password.split('$');
            let salt = passwordFields[0];
            let hash = crypto.createHmac('sha512', salt).update(value.password).digest("base64");
            if (hash === passwordFields[1]) {
                // Generate an access token
                const accessToken = generateJwtToken(acc);
                const refreshToken = generateRefreshToken(acc, req.ip);
                await refreshToken.save();
                return res.json({
                    ...acc.toJSON(),
                    ...{token: accessToken, refreshToken : refreshToken.token}
                });
                
                //return next();
            } 


        }
        
        res.status(403).json({message: 'invalid login'});

    },
    refresh : async (req, res, next) => {

        const schema = Joi.object({
            token: Joi.string().required().min(80).max(80)
        });

        let {value, error} = schema.validate(req.body);
        if(error){
            return next(error);            
        }

        const refreshToken = await RefreshTokenModel.findOne({token: value.token});
        if(!refreshToken || !refreshToken.isActive){
            return next(new Error('Authentication error'));
        }

        console.log('found a refresh token ', refreshToken);

        const account = await AccountModel.findOne({id: refreshToken.account});
        if(!account){
            return next(new Error('Authentication error'));
        }

        // replace old refresh token with a new one and save
        const newRefreshToken = generateRefreshToken(account, req.ip);
        refreshToken.revoked = Date.now();
        refreshToken.revokedByIp = req.ip;
        refreshToken.replacedByToken = newRefreshToken.token;
        await refreshToken.save();
        await newRefreshToken.save();

        // generate new jwt
        const jwtToken = generateJwtToken(account);

        // return basic details and tokens
        return res.json({
            ...account.toJSON(),
            ...{token: jwtToken, refreshToken : newRefreshToken.token}
        });
    },
    logout : async (req, res) => {
        const schema = Joi.object({
            token: Joi.string().required().min(80).max(80)
        });

        let {value, error} = schema.validate(req.body);
        if(error){
            return next(error);            
        }

        const refreshToken = await RefreshTokenModel.findOne({token: value.token});
        if(refreshToken && refreshToken.isActive){
            // revoke token and save
            refreshToken.revoked = Date.now();
            refreshToken.revokedByIp = req.ip;
            await refreshToken.save();
        }
        return res.json();
    
    },

    delete: async (req, res) => {
        const schema = Joi.object({
            id: Joi.string().required().min(1).max(80)
        });

        let {value, error} = schema.validate(req.params);
        if(error){
            return next(error);            
        }
        // users can delete their own account and admins can delete any account
        if (value.id !== req.acc.id && req.acc.role !== roles.ADMIN) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await AccountModel.deleteOne(value.id);
        return res.json({ message: 'Account deleted successfully' });

    }


}