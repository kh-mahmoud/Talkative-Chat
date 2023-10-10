import { prisma } from "../lib.js"


export const allusers=async(req,res)=>
{
   const searchQuery = req.query.search?.toLowerCase();
   try {
    if(!searchQuery)
    {
       const users =await prisma.user.findMany({where:{id:{not:req.user.id}},select: {
        id: true,
        name: true,
        email: true,
        pic: true,
        chatId: true,
        chatadminId: true,
        createdAt: true,
        updatedAt: true,
        chat: true,
        chatadmin: true,
        message: true,
        _count: true,
        password: false // Exclude the password field
      }})
       return res.status(200).json({users})
    }
    
 
   
    const allUsers = await prisma.user.findMany({where:{id:{not:req.user.id}},  select: {
      id: true,
      name: true,
      email: true,
      pic: true,
      chatId: true,
      chatadminId: true,
      createdAt: true,
      updatedAt: true,
      chat: true,
      chatadmin: true,
      message: true,
      _count: true,
      password: false // Exclude the password field
    }});
    
    // Filter users based on the case-insensitive search query
    const users = allUsers.filter(user => {
      return (
        user.email.toLowerCase().includes(searchQuery) ||
        user.name.toLowerCase().includes(searchQuery)
      );
    });
    if(users)
    {
      return res.status(200).json({ users });
    }else{
      return res.status(200).json({ users:"Not found" });
    }
  
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