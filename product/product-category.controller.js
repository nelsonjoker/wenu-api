const ProductCategoryModel = require('./product-category.model');
const Joi = require('joi');

module.exports = {
    create : async (req, res, next) => {

        const schema = Joi.object({
            name: Joi.string().required().min(1).max(30),
            description: Joi.string().max(255),
        });

        const {error, value} = schema.validate(req.body);
        if(error){
            return next(error);
        }

        const category = new ProductCategoryModel(value);
        const m = await category.save();

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
            name: Joi.string().required().min(1).max(30),
            description: Joi.string().max(255),
        });

        let {value, error} = schema.validate(req.body);
        if(error){
            return next(error);
        }
        
        const c = await ProductCategoryModel.findById(id);
        if(!c){
            return next(new Error('category not found'))
        }
        c.set(value);
        const r = await c.save();
        return res.json(c);

    },

    getById: async (req, res, next) => {

        const schema = Joi.object({
            id: Joi.string().required()
        });

        const {value, error} = schema.validate(req.params);
        if(error){
            return next(error);
        }

        const c = await ProductCategoryModel.findById(value.id);
        return res.json(c);

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
        const categories = await ProductCategoryModel.find()
            .limit(value.count)
            .skip(value.count * value.page);
        return res.json(categories);
    },
    delete: async (req, res, next) => {

        const schema = Joi.object({
            id: Joi.string().required()
        });

        const {value, error} = schema.validate(req.params);
        if(error){
            return next(error);
        }

        const c = await ProductCategoryModel.findByIdAndDelete(value.id);
        return res.json(c);

    },

    



}