const UserModel = require('../model/user.model');
const crypto = require('crypto');
const Joi = require('joi');
const {roles} = require('../../config');


module.exports = {
    
    getById: (req, res, next) => {

        const schema = Joi.object({
            id: Joi.string().required().min(16)
        });

        const {value, error} = schema.validate(req.params);
        if(error){
            return next(error);
        }

        const id = req.params.id;
        UserModel.findById(id).then((u) => res.json(u));

    },
    getAll: async (req, res, next) => {
        const schema = Joi.object({
            page: Joi.number().default(0),
            count: Joi.number().default(10),
        });
        const {value, error} = schema.validate(req.params);
        if(error){
            return next(error);
        }
        const users = await UserModel.list(value.count, value.page);
        res.json(users);
    },
    create : (req, res, next) => {

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
        
        UserModel.createUser(userData)
            .then((u) => {
                res.status(201).json(u);
            });
    }



}