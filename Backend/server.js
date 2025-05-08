const express=require('express');
const dotenv=require('dotenv').config();
const cors=require('cors');
const connectDB = require('./config/dbConnection');
const app=express();
const auth=require("./routes/auth.js");
const list=require("./routes/list.js");

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

app.use("/api",auth);
app.use("/api",list);

connectDB();
app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})