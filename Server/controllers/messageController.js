import { prisma } from "../lib.js";




export const sendMessage=async(req,res)=>
{
   const {chatId,content}=req.body

   if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
     const message=await prisma.message.create({
        data:{
            sender:{
                connect:{id:req.user.id}
            },
            content,
            chat:{
                connect:{id:chatId}
            },
       }
        ,include:{
           sender:{
            select:{
                name:true,
                pic:true,
                id:true
            }
           } ,
           chat:true
        }
     })
     
     const latestmessage=await prisma.chat.update({where:{id:chatId},data:{
        latestmessage:{
            connect:{id:message.id}
        }
     }})
 

     res.send(message)

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


export const allMessages=async(req,res)=>
{
    try {
        const messages=await prisma.message.findMany({where:{chatId:req.params.chatId},include:{
            sender:{select:{
                id:true,
                name:true,
                email:true,
                pic:true}}
            ,
            chat:{select:{
                members:true,
                name:true,
            }},
            chatAsLatestMessage:{select:{
               latestmessage:{
                  select:{
                    createdAt:true,
                    content:true,
                    sender:{
                        select:{
                            name:true
                        }
                    }
                  }
               }
            }}

        }})

        res.send(messages)
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