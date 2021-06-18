const express = require('express');
const users = require("./controllers/userController");
const addbook = require("./controllers/addressController");
const cors = require("cors");
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"static/uploads/")
    },
    filename: function(req,file,cb){
        cb(null,Date.now() + "-"+ file.originalname)
    }
})
const multipart = multer({storage: storage});
const mongoose = require('mongoose');
const { compareSync } = require('bcrypt');
mongoose.connect("mongodb://127.0.0.1:27017/addressbook", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("Mongo is ON");
}).catch((e) => console.log("error while connecting to mongo:", e.message));


const app = express();
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}))
app.use(
    cors({
        origin: "*"
    })
)
app.use(express.json());





app.post('/signUp',multipart.single("profilePic"), async (req,res) => {

    let result = await users.addUser(req.body);
    console.log(result);
    if(result.status) {
        res.status(201).json(result.result);

    }else{
        res.status(400).json(result.result);
    }

})



app.post('/login',multipart.single("profilePic"), async (req,res) => {

    let result = await users.loginUser(req.body);
    console.log("fsdf",result.result);
    if(result.status) {
        console.log(result.result.message.email)
        let payload = {email: result.result.message.email}
        console.log("hehehe",payload)
        let token = jwt.sign(payload,"thisisthekey");
        console.log(token);
        res.status(201).json({token})

    }else{
        res.status(400).json(result.result);
    }

})







app.post('/add',multipart.single("profilePic"), async (req,res) => {
    console.log("here",req.headers.authorization)
    if(!req.headers.authorization){
        res.status(403).json({message: "no token"})
    }
    if(req.headers.authorization){
        let decoded = jwt.verify(req.headers.authorization,"thisisthekey")
        let id = await users.findUser(decoded.email);
        let payload = req.body;
        payload.user = id
        let result = await addbook.addAddress(payload);
        console.log("res",result)

        res.status(200).send(req.headers.authorization)
    }
    


})


app.get('/add',multipart.single("profilePic"), async (req,res) => {
    if(!req.headers.authorization){
        res.status(403).json({message: "no token"})
    }
    if(req.headers.authorization){
        let decoded = jwt.verify(req.headers.authorization,"thisisthekey")
        let id = await users.findUser(decoded.email);
        let payload = req.body;
        payload.user = id
        let result = await addbook.getAddress(id);
        console.log("res",result)

        res.status(200).send(result)
    }

})

app.delete('/del/:delId',multipart.single("profilePic"), async (req,res) => {
    if(!req.headers.authorization){
        res.status(403).json({message: "no token"})
    }
    let {delId} = req.params
    console.log("delid",delId)
    if(req.headers.authorization){
        let decoded = jwt.verify(req.headers.authorization,"thisisthekey")
        let id = await users.findUser(decoded.email);
        let result = await addbook.deleteAddress(delId);
        console.log("res",result)

        res.status(200).send(result)
    }

})

app.put('/del/:delId',multipart.single("profilePic"), async (req,res) => {
    if(!req.headers.authorization){
        res.status(403).json({message: "no token"})
    }
    let {delId} = req.params
    console.log("delid",delId)
    if(req.headers.authorization){
        let decoded = jwt.verify(req.headers.authorization,"thisisthekey")
        let id = await users.findUser(decoded.email);
        let result = await addbook.updateAddress(delId);
        console.log("res",result)

        res.status(200).send(result)
    }

})






const PORT = 3300

app.listen(PORT, () => {
    console.log("server at "+PORT)
})