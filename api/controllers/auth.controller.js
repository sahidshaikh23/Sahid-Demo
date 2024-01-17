import User from "../models/user.model.js";

import bcryptjs from "bcryptjs";
import { errorHandler } from "../utlis/error.js";

import jwt from "jsonwebtoken";

const SECRET="Sahid";
export const singup=async(req,res,next)=>
{
    const {username,email,password}=req.body;

      const hashPassword=bcryptjs.hashSync(password,10);

    const newUser=new User({username,email,password:hashPassword});

    try{
        await newUser.save();

    res.status(200).json({
        success:true,
        message:"User Created Successfully"
    });

    }catch(e)
    {
  next(errorHandler(300,"Something went wrong"));
    }


}

export const signin=async(req,res,next)=>{

  const {email,password}=req.body;

  try{

    const validUser=await User.findOne({email});
    if(!validUser)
    {
      return next(errorHandler(300,"User Not Found"));


    }
    const validPassword=bcryptjs.compareSync(password,validUser.password);

    if(!validPassword)
    {
      return next(errorHandler(300,"Invalid Password"));

    }
    const token=jwt.sign({id:validUser._id},SECRET);

const expirationDate=new Date(Date.now()+3600000);


    const {password:passwordHash,...rest}=validUser._doc;
    res.cookie("access_token",token,{
   httpOnly:true,
expires:expirationDate

    }).status(200).json({
      rest
    })

  }catch(e)
  {
    next(e)
  }
}