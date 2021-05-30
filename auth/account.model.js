const mongoose = require('../common/mongoose.service').mongoose;
const Schema = mongoose.Schema;


const schema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    acceptTerms: Boolean,
    roles: { type: [String], required: true },
    verificationToken: String,
    verified: Date,
    resetToken: {
        token: String,
        expires: Date
    },
    passwordReset: Date,
    created: { type: Date, default: Date.now },
    updated: Date
});

schema.virtual('id').get(function () {
    return this._id.toHexString();
});


schema.virtual('isVerified').get(function () {
    return !!(this.verified || this.passwordReset);
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.password;
    }
});

schema.statics.findByEmail = async function(email){
    return this.model('Account').findOne({email: email});
}

module.exports = mongoose.model('Account', schema);