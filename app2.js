const express = require("express");
const cors = require("cors");
const morgan = require("morgan")
const mongoose = require("mongoose");
const Users = require("./controllers/userController")
const RequestTokens = require("./controllers/refreshTokenController");
const AddressBook = require("./controllers/addressController")

mongoose.connect("mongodb://127.0.0.1:27017/addressbook", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("Mongo is ON");
}).catch((e) => console.log("error while connecting to mongo:", e.message));

const app = express();
app.use(morgan('dev'));
app.use( cors({origin: "*"}));
app.use(express.json());
const userRouter = require("./routes/userRoute");
const addressRouter = require("./routes/addressRoute");



app.use("/users/",userRouter);
app.use("/address/",addressRouter);


// app.post("/signup", async (req,res) => {

//     let user = await Users.addUser(req.body);
//     if(user.status){
//         res.status(201).json(user.result)
//     }else{
//         res.status(400).json(user.result)
//     }


// })

// app.post("/login", async (req,res) => {
//     let response = await Users.loginUser(req.body);
//     if(response.status){
//         let payload = {email: response.result.email}
//         let token = jwt.sign(payload,"thisistokensecret",{expiresIn:"1d" })
//         let refreshToken = jwt.sign(payload,"thisisrefreshtokenbaby", {expiresIn: '7d'});
//         await RequestTokens.addRefreshToken({email: response.result.email, token: refreshToken})
//         res.status(201).json({token,refreshToken})
//     }else{
//         res.status(400).json(response.result)
//     }
// })










app.all(/.*/, (req,res) => {
    console.log(req)
    console.log("hi")
    res.status(200).json({message: "WELCOME To Address API"})
})

const PORT = 3300

app.listen(PORT, () => {
    console.log("server is listening on PORT: " +PORT)
})