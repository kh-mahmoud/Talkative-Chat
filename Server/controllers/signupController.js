import { prisma } from "../lib.js"
import {check,validationResult} from "express-validator"
import bcrypt from "bcrypt"
import { generateToken } from '../config/generateToken.js'
import { generateRefreshToken } from "../config/generateRefreshToken.js"


export const registerUser=async(req,res)=>
{
   const {name,email,password,pic}=req.body

     
  await check('email').isEmail().withMessage('Please enter a valid email address').run(req);
  await check('password').isLength({ min: 5, max: 10 }).withMessage('Password must be between 5 and 10 characters').run(req);


      const errors=validationResult(req)
  
      if(!errors.isEmpty())
      {
          return res.status(400).json({
             errors:errors.array()
          })
      }

      try {
         
      const finduser=await prisma.user.findFirst({where:{email:email}})
      if(finduser)
      {
         return res.status(400).json(
            {errors:[
            {
               "msg":"This user already exist"
            }
         ]})
      }

      let hashpassword=await bcrypt.hash(password,10)

      const user=await prisma.user.create({data:{
         name,
         email,
         password:hashpassword,
         pic,
      }})

         res.cookie('token', generateToken({id:user.id,name:user.name,pic:user.pic,email:user.email}), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
          });

          res.cookie('refreshToken', generateRefreshToken({id:user.id,name:user.name,pic:user.pic,email:user.email}), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
          });
        
          res.send("good")
       
   
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