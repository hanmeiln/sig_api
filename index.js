const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const adatRoute = require("./routes/adat");
const authRoute = require("./routes/auth");
const provinceRoute = require("./routes/province");
const userRoute = require("./routes/user");
var cors = require('cors');


app.use(cors());
dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DBConnection Successfull!"))
    .catch((err) => {
    console.log(err);
});

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/adat", adatRoute);
app.use("/api/user", userRoute);
app.use("/api/province", provinceRoute);


app.listen(process.env.PORT || 5000, ()=>{
    console.log("Backend server is running!");
});