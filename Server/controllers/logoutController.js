







export const logout=async(req,res)=>
{
     res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite:'None' });
     res.clearCookie('refreshToken', { httpOnly: true ,secure: process.env.NODE_ENV === 'production', sameSite:'None' });

     res.send("deleted")
}
