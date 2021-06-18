const express = require('express');
const users = require("./controllers/userController");
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
    console.log(result);
    if(result.status) {
        let payload = {email: result.result.email}
        let token = jwt.sign(payload,"thisisthekey");
        console.log(token);
        res.status(201).json({token})

    }else{
        res.status(400).json(result.result);
    }

})



app.post('')



const PORT = 3300

app.listen(PORT, () => {
    console.log("server at "+PORT)
})