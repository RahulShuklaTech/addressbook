const express = require("express")
const router = express.Router();
const {addUser,loginUser,findUser} = require("../controllers/userController");
const {addAddress,getAddress,deleteAddress,updateAddress,getAddressByCity,getAddressByState} = require("../controllers/addressController")
const jwt = require("jsonwebtoken");

let decoded = "";

const validateRequest = (req,res,next) => {

    let authHeader = req.headers['authorization'];
    if(!authHeader){
        res.status(403).json({message: 'No header in request'})
        return;
    }
    let token = authHeader.split(" ")[1];
    console.log(token)
    if(!token){
        res.status(403).json({message: 'No token in request'})
        return;
    }
    try {
        decoded = jwt.verify(token,"thisistokensecret")
        // console.log("decoded",decoded)
        next();
    } catch (e){
        console.log("happend here")
        res.status(403).json({message: "Wrong token"+e.message})
    }
}






router.post("/",validateRequest, async (req, res) => {
    
    console.log("decoded2",decoded)
    let user = await findUser(decoded.email);
    console.log("user",user)
    let payload = req.body;
    payload.user = user.result.message._id
    let address = await addAddress(payload)
    await user.result.message.update({$push: {addresses : address._id}}) 
    console.log("user",address)
    
    res.status(200).json({message: "everything went as expected" })


})



router.delete("/:delId",validateRequest, async (req,res) => {
    let {delId} = req.params
    let user = await findUser(decoded.email);
   
    if(user.status){
        let deleted = await deleteAddress(delId);
        if(deleted){
            
            res.status(200).json(deleted);

            return;
        }
        res.status(404).json({'response': 'cant delete user'})
        return;
    }
    res.status(404).json({'response': 'cant find user'})
    return;

})


router.patch("/:id",validateRequest, async (req,res) => {
    let {id} = req.params;
    let address = await updateAddress(id,req.body);
    if(address){
        res.status(200).json({"message" : address})
    }
    res.status(400).json({"message": "error in deleting addresss"})

})
 
router.get("/",validateRequest, async (req,res) => {
    let user = await findUser(decoded.email)
    console.log("user",user)
    let id = user.result.message._id;
    console.log("id",id)
    let addresses = await getAddress(id);
    if(addresses){
        res.status(200).json({"message": addresses })
    }else{
        res.status(400).json({"message": addresses })
    }

})


router.get("/city/:cityName",validateRequest, async (req,res) => {
    let {cityName} =  req.params;
    let user = await findUser(decoded.email)
    // console.log("user",user)
    let id = user.result.message._id;
    console.log("city",cityName)
    let addresses =await getAddressByCity(id,cityName)
    console.log("add", addresses)
    if(addresses){
        res.status(200).json({"message": addresses })
    }else{
        res.status(400).json({"message": addresses })
    }


})


router.get("/state/:state",validateRequest, async (req,res) => {
    let {state} =  req.params;
    let user = await findUser(decoded.email)
    // console.log("user",user)
    let id = user.result.message._id;
    console.log("city",state)
    let addresses =await getAddressByState(id,state)
    console.log("add", addresses)
    if(addresses){
        res.status(200).json({"message": addresses })
    }else{
        res.status(400).json({"message": addresses })
    }


})



module.exports = router