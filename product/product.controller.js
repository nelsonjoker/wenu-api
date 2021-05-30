const ProductModel = require('./product.model');
const CategoryModel = require('./product-category.model');
const Joi = require('joi');

module.exports = {
    create : async (req, res, next) => {

        const catSchema = Joi.object({cat: Joi.string().required().max(50)});
        const {value: v, error: e} = schema.validate(req.params);
        if(error){
            return next(error);
        }

        const cat = await CategoryModel.findById(v.cat);
        if(!cat){
            throw new Error('Category not found');
        }

        const schema = Joi.object({
            name: Joi.string().required().min(1).max(30),
            description: Joi.string().max(255),
            price: Joi.number().greater(0),
            img: Joi.string().max(255)
        });

        const {error, value} = schema.validate(req.body);
        if(error){
            return next(error);
        }
        value.category = cat.id;

        const prod = new ProductModel(value);
        const r = await prod.save();

        res.json(r);
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
            price: Joi.number().greater(0),
            img: Joi.string().max(255)
        });

        let {value, error} = schema.validate(req.body);
        if(error){
            return next(error);
        }

        if(value.img){
            //image uploaded...

        } else {
            delete value.img; //no image upload remove field to prevent update
        }
        
        const p = await ProductModel.findById(id);
        if(!p){
            return next(new Error('Product not found'))
        }
        p.set(value);
        const r = await p.save();
        return res.json(r);

    },

    getById: async (req, res, next) => {

        const schema = Joi.object({
            id: Joi.string().required()
        });

        const {value, error} = schema.validate(req.params);
        if(error){
            return next(error);
        }

        const p = await ProductModel.findById(value.id);
        return res.json(p);

    },
    getAll: async (req, res, next) => {
        const schema = Joi.object({
            cat: Joi.string().required().max(50),
            page: Joi.number().default(0),
            count: Joi.number().default(10),
        });
        const {value, error} = schema.validate(req.params);
        if(error){
            return next(error);
        }
        const products = await ProductModel.find({category: value.cat})
            .limit(value.count)
            .skip(value.count * value.page);
        return res.json(products);
    },
    delete: async (req, res, next) => {

        const schema = Joi.object({
            id: Joi.string().required()
        });

        const {value, error} = schema.validate(req.params);
        if(error){
            return next(error);
        }

        const p = await ProductModel.findByIdAndDelete(value.id);
        return res.json(p);

    },

    



}