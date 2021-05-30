const TableModel = require('./table.model');
const Joi = require('joi');

module.exports = {
    create : async (req, res, next) => {

        const schema = Joi.object({
            code: Joi.string().required().min(1).max(10),
            capacity: Joi.number().required(),
        });

        const {error, value} = schema.validate(req.body);
        if(error){
            return next(error);
        }

        const table = new TableModel(value);
        const m = await table.save();

        res.json(m);
    },
    update: async (req, res, next) => {

        let schema = Joi.object({
            id: Joi.string().required()
        });

        let {value: v, error: e} = schema.validate(req.params);
        if(e){
            return next(e);
        }
        const id = v.id;
        schema = Joi.object({
            code: Joi.string().required().min(1).max(10),
            capacity: Joi.number().required(),
        });

        let {value, error} = schema.validate(req.body);
        if(error){
            return next(error);
        }
        
        const t = await TableModel.findById(id);
        if(!t){
            return next(new Error('table not found'))
        }
        t.set(value);
        const r = await t.save();
        return res.json(t);

    },

    getById: async (req, res, next) => {

        const schema = Joi.object({
            id: Joi.string().required()
        });

        const {value, error} = schema.validate(req.params);
        if(error){
            return next(error);
        }

        const t = await TableModel.findById(value.id);
        return res.json(t);

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
        const tables = await TableModel.find()
            .limit(value.count)
            .skip(value.count * value.page);
        return res.json(tables);
    },
    delete: async (req, res, next) => {

        const schema = Joi.object({
            id: Joi.string().required()
        });

        const {value, error} = schema.validate(req.params);
        if(error){
            return next(error);
        }

        const t = await TableModel.findByIdAndDelete(value.id);
        return res.json(t);

    },

    



}