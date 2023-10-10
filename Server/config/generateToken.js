import JWT from "jsonwebtoken"


export const generateToken=(user)=>
{
    const token =JWT.sign(user,process.env.JWT_SECRET,{
        expiresIn:'15m'
    })
    return token
}