import express from "express";

import mongoose from "mongoose";


import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

import path from "path";

mongoose.connect("mongodb+srv://Auth:Tt9cY7U84PBDw2JV@cluster0.uzgdlav.mongodb.net/?retryWrites=true&w=majority").then(()=>
{
    console.log("DataBase Is Successfully connected ")
}).catch((e)=>
{
    console.log(e)
})

const __dirname=path.resolve();

const app=express();

app.use(express.static(path.join(__dirname,'/Client/dist')))

app.get('*',(req,res)=>
{
    res.sendFile(path.join(__dirname,'/Client/dist/index.html'))
});

app.use(express.json());


app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

app.use("/api/user",userRoutes);
app.use('/api/auth',authRoutes);


app.use((error,req,res,next)=>
{
    const status=error.statusCode||500;
    const message=error.message || "Internal Server Error";

    return res.status(status).json({
      success:false,  message,status});


})