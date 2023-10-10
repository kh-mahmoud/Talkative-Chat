import { generateToken } from "../config/generateToken.js"
import { generateRefreshToken } from "../config/generateRefreshToken.js"

import { prisma } from "../lib.js"
import bcrypt from "bcrypt"



export const loginUser=async(req,res)=>
{
   const {email,password}=req.body

   try {
     const user=await prisma.user.findFirst({where:{email:email}})
   if(!user)
   {
      return res.status(400).json(
         {errors:[
         {
            "msg":"Invalid Credentials"
         }
      ]})
   }

   let isMatch= await bcrypt.compare(password,user.password)

   if(!isMatch)
   {
      return res.status(400).json(
         {errors:[
         {
            "msg":"Invalid Credentials"
         }
      ]})
   }
   
   
    res.cookie('token', generateToken({id:user.id,name:user.name,pic:user.pic,email:user.email}), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      domain: 'talkative12.netlify.app',
      path: '/admin'
    });
    
    res.cookie('refreshToken', generateRefreshToken({id:user.id,name:user.name,pic:user.pic,email:user.email}), {
      httpOnly: true,
      domain: 'talkative12.netlify.app',
      path: '/admin',
      secure: process.env.NODE_ENV === 'production'
   
    });
  
   
    res.status(200).json({
       message:"good"
   })

} catch (error) {
    console.log(error)
    return res.status(500).json(
      {errors:[
      {
         "msg":"server probleme"
      }
   ]})}finally {
    await prisma.$disconnect()
  }



}
