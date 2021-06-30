const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const RequestTokens = require("../controllers/refreshTokenController");


const {addUser,loginUser,findUser} = require("../controllers/userController");

router.get("/",(req,res) => {
    res.status(200).json({hello:"world"})
})

router.post("/signup", async (req,res) => {

    let user = await addUser(req.body);
    if(user.status){
        res.status(201).json(user.result)
    }else{
        res.status(400).json(user.result)
    }


})

router.post("/login", async (req,res) => {
    let response = await loginUser(req.body);
    if(response.status){
        let payload = {email: response.result.email}
        let token = jwt.sign(payload,"thisistokensecret",{expiresIn:"1d" })
        let refreshToken = jwt.sign(payload,"thisisrefreshtokenbaby", {expiresIn: '7d'});
        await RequestTokens.addRefreshToken({email: response.result.email, token: refreshToken})
        res.status(201).json({token,refreshToken})
    }else{
        res.status(400).json(response.result)
    }
})

router.post("/token", async (req,res) => {

    const {refreshToken} = req.body;
    const response = await RequestTokens.findRefreshToken(refreshToken)

    if(!refreshToken || !response.status ){
        res.status(403)
    }

    try{
        let refreshTokenPayload = jwt.verify(refreshToken,"thisisrefreshtokenbaby");
        let newPayload = {email: refreshTokenPayload.email}
        let token = jwt.sign(newPayload,"thisistokensecret", { expiresIn : "30s"})
        res.status(200).json({token})

    } catch(e){
        console.log("error in token",e.message)
        res.status(401).json({error: "token expired"})
    }


})



module.exports = router