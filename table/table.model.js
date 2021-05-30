const mongoose = require('../common/mongoose.service').mongoose;
const Schema = mongoose.Schema;


const schema = new Schema({
    code: { type: String, required: true },
    capacity: Number,
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


module.exports = mongoose.model('Table', schema, 'table');