import {chats} from "../data/dummy.js"
import { prisma } from "../lib.js"


export const accesschats=async(req,res)=>
{
   const {userId}=req.body

   const ischat= await prisma.chat.findFirst({where:{
      isGroupe:false,
      AND:[{members:{some:{id:userId}}},{members:{some:{id:req.user.id}}}],
   },include:{members:true,latestmessage:true}})

   if(ischat)
   {
      res.status(200).send(ischat)
   }else
   {
      try {
         const createChat = await prisma.chat.create({
            data: {
              name: "sender",
              isGroupe: false,
              members: {
                connect: [
                  { id: userId },        // Connect the user with userId
                  { id: req.user.id },   // Connect the authenticated user
                ],
              },
            },
            include: {
              members: true,          // Include the members field from the chat model
              latestmessage: true,     // Include the latestmessage field from the chat model
            },
          });

          const fullchat = await prisma.chat.findUnique({
            where: { id: createChat.id },
            include: {
              members: true,          // Include the members field from the chat model
              latestmessage: true,     // Include the latestmessage field from the chat model
            },
          });
         res.status(200).send(fullchat)
      }  catch (error) {
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
}

// Fetch chats

export const fetchChats=async(req,res)=>
{
   try {
       await prisma.chat.findMany({where:{memberId:{has:req.user.id}},include:{
         latestmessage:{select:{
          content:true,
          createdAt:true,
          id:true,
          sender:{select:{name:true,id:true}}}},
         members:true,
         groupeadmin:true
      },orderBy:{
         latestmessage:{createdAt:"desc"}
      }}).then((result)=>
       res.send(result))
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

//create groupe chat

export const createGroupChat = async (req, res) => {
   const { selectedUsers} = req.body;
   const { groupChatName } = req.body;
   const users=selectedUsers.map((u)=>u.id)

   
   if (!users || !groupChatName) {
     return res.status(400).json({ msg: "Fill all the Fields " });
   }

   users.push(req.user.id)

   if (users.length < 2) {
      return res.status(400).send("You need more than 2 to create a group");
    }
  
 
   try {
     const groupe = await prisma.chat.create({
       data: {
         name: groupChatName,
         isGroupe: true,
         members: {
           connect: users.map(userId => ({ id: userId })), // Connect multiple users
         },
         groupeadmin: {
           connect: {
             id: req.user.id,
           },
         },
       },
     });
 
     const fullgroupe = await prisma.chat.findFirst({
       where: { id: groupe.id },
       include: { members: true, groupeadmin: true },
     });
     
     res.status(200).json(fullgroupe);
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
 };

 //rename groupe

 export const  renameGroupChat = async (req, res) => {
     
   const {name,chatId}=req.body
    try {
      const chat=await prisma.chat.update({where:{id:chatId,isGroupe:true},
        data:{
          name,
      },include:{members:true,groupeadmin:true}})

      if(chat)
      {
          res.json(chat)
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

 };

//add memebers to groupe
 
 export const   addToGroup = async (req, res) => {

  const {userId,chatId}=req.body
  try {
    const added = await prisma.chat.update({where:{id:chatId},
      data:{
        members:{
          connect:{
            id:userId
          }
        }
      },include:{
        members:true,
        groupeadmin:true
      }})
  
      if(added)
      {
        res.send(added)
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
          
  }};

  //remove user 

  export const removeFromGroup = async (req, res) => 
  {

    const {userId,chatId}=req.body
  try {
    const removed = await prisma.chat.update({where:{id:chatId},
      data:{
        members:{
          disconnect:{
            id:userId
          }
        },
        groupeadmin:{
          disconnect:{
            id:userId
          }
        }
      },include:{
        members:true,
        groupeadmin:true
      }})
  
      if(removed)
      {
        res.send(removed)
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


 





export const getchats=async(req,res)=>
{

   res.send(chats) 
}





