







export const logout=async(req,res)=>
{
     res.clearCookie('token', { httpOnly: true });
     res.clearCookie('refreshToken', { httpOnly: true });

     res.send("deleted")
}