const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user"
    },
    
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        
        required: true
    },
    country: {
        type: String,
        required: true
    },
    addressLine1: {
        type: String,
        required: true

    },
    label: {
        type: String
    }
   
   
}, {timestamps: true})


const addressModel = new mongoose.model('address',adressSchema);

module.exports = addressModel;