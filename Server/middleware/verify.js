import verify  from "jsonwebtoken";
import jwt from "jsonwebtoken"
import jwtDecode from "jwt-decode";
import { generateRefreshToken } from "../config/generateRefreshToken.js";
import { generateToken } from "../config/generateToken.js";


export const verifytoken=async(req,res,next)=>
{
    const token = req.cookies.token;
    const refreshtoken = req.cookies.refreshToken;

    if(token)
    {
        if(refreshtoken)
        {
            jwt.verify(refreshtoken,process.env.JWT_REFRESH_SECRET,(err,user)=>
            {
                if(err)
                {
                    return res.status(403).json({state:'unauthorized'})
                }
                 let decoded=jwtDecode(token)
                let currentDate = new Date();
    
                if (decoded.exp * 1000 < currentDate.getTime()) 
                {
                    res.clearCookie('token', { httpOnly: true });
                    res.clearCookie('refreshToken', { httpOnly: true });
                    // This also gives you { id: '001', email: 'guest@example.com' }
    
                    res.cookie('token', generateToken({ id: user.id, email:user.email,name:user.name,pic:user.pic}), {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production', // Set to true in production
                      });
                      
                      res.cookie('refreshToken', generateRefreshToken({ id: user.id, email:user.email,name:user.name,pic:user.pic }), {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production', // Set to true in production
                      });
                }
                req.user=user
                next()
            })
        }
        else
        {
            return res.status(401).json({state:'unauthenticated'})
    
        }
      
    }
    else
    {
        return res.status(401).json({state:'unauthenticated'})

    }

   


}