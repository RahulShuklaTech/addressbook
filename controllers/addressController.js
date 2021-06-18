const User = require("../models/user");
const Address = require("../models/address");


const addAddress = async ({user,city,pincode,state,country,addressLine1,addressLine2,label}) => {
    
    try{
        const add = new Address({user,city,pincode,state,country,addressLine1,addressLine2,label}) ;
        await add.save();
        return add;
    }catch(e){
        console.log(e.message)
        return false
        
    }


}

const getAddress =  async  (id) => {
    try{
        console.log(id)
        let data = await Address.find({user:id});
        console.log(data)
        return data

    }catch(e){
        console.log(e.message)
    }
}


const deleteAddress = async (id) => {
    try{
        let data = await Address.findOne({_id:id});
        console.log("datg", data)
        let result = await data.remove();
        return result;
    }catch(e){
        console.log(e.message)
        return false;
    }
}

const updateAddress = async (update) => {
    
}

module.exports = {addAddress,getAddress,deleteAddress}