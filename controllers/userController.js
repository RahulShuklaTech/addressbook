const User = require("../models/user");
const bcrypt = require("bcrypt");



const addUser = async ({name,email,password}) => {

    let emailRegex = /.*@*\../;
    if(!emailRegex.test(email)){
        return {status: false, result: {message: "Invalid Email"}};

    }
    if(!password) {
        return {status: false, result : {message: "Password is required"}};

    }
    if(!name) {
        return {status: false, result : {message: "name is required"}};

    }

    let hash = await bcrypt.hash(password, 10)

    try {
        let user = new User ({name,email,password: hash});
        let savedUser = await user.save();
        return {status: true, result : {message: savedUser}};
    }catch(e){
        console.log(e.message);
        
    }return {status: false, result : {message: e.message}};
}


const loginUser = async ({email,password}) => {
    try{
        let user = await User.findOne({email});
        if(user == null){
            return {status: false, result: {message: "invalid email"}}
        }
        let result = await bcrypt.compare(password,user.password);
        if(!result){
            return{status: false, result: {message: "invalid password"}}
        }
        return {status: true, result: {message: user }}
    }catch(e){

        return {status: false, result: {message: e.message }}
    }
}


const findUser = async (email) => {
    try{
        let user = await User.findOne({email});
        if(user == null){
            return {status: false, result: {message: "invalid email"}}
        }
        return user.id
    }catch(e){
        return false
    }
}




module.exports = {addUser,loginUser,findUser}