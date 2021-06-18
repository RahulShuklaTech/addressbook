const User = require("../models/user");
const Address = require("../models/address");


const addAddress = async ({id,city,pincode,state,country,addressLine1,addressLine2,label}) => {
    
    const owner = await User.findOne({id});



}
