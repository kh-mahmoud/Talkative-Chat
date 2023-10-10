import JWT from "jsonwebtoken"


export const generateRefreshToken=(user)=>
{
    const token =JWT.sign(user,process.env.JWT_REFRESH_SECRET)
    return token
}