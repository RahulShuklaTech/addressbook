const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    addresses: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "addresses"

    }
   
   
}, {timestamps: true})


const userModel = new mongoose.model('User',userSchema);

module.exports = userModel;