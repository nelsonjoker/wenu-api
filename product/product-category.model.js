const mongoose = require('../common/mongoose.service').mongoose;
const Schema = mongoose.Schema;


const schema = new Schema({
    name: { type: String, required: true },
    description : String,
    created: { type: Date, default: Date.now },
    updated: Date
});

schema.virtual('id').get(function () {
    return this._id.toHexString();
});


schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    }
});


module.exports = mongoose.model('ProductCategory', schema);