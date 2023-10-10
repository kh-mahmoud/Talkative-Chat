import express from "express";
import { Configuration, OpenAIApi } from "openai";
import cors from "cors"
import * as dotenv from 'dotenv'
import userRouter from './Routes/userRoutes.js';
import cookieParser from "cookie-parser"
import chatsRouter from './Routes/chatsRoutes.js'
import messageRouter from './Routes/messageRoutes.js'
import auth from "./Routes/auth.js"

import http from 'http'
import { Server } from "socket.io";
import path from 'path'
import { fileURLToPath } from "url";
import { prisma } from "./lib.js";



dotenv.config()
const corsConfig = {
    origin: 'https://talkative12.netlify.app', // Set the client-side domain here
    credentials: true,
  };
  
  
const app=express()
app.use(cors(corsConfig));
app.options('*', cors(corsConfig))
app.use(cookieParser());
app.use(express.json());


// // --------------------------deployment------------------------------

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/dist")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1,  "dist", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

// // --------------------------deployment------------------------------






// app.get("/api/chat/:id",(req,res)=>
// {
//     const singlechat=chats.find((c)=>c._id==req.params.id) 
//     res.send(singlechat)

// })

app.use("/api/users",userRouter)
app.use("/api/chat",chatsRouter)
app.use("/api",auth)
app.use("/api/message",messageRouter)





//scoket io

const __filename= fileURLToPath(import.meta.url)
export const __dirname= path.dirname(__filename)

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

const httpServer = http.createServer(app);
const io=new Server(httpServer, {
  pingTimeout:60000,
  cors: {
    origin: process.env.NODE_ENV === 'production'?"https://talkative12.netlify.app":"http://localhost:5173"
  }
})

io.on('connection',(socket)=>{


   
  socket.on("setup",(userData)=>
  {
    socket.join(userData.id)
    socket.emit("connection")
  })

  socket.on("join chat",(room)=>
  {
    socket.join(room)
  })

  socket.on("new message",async(messageRecieved,authuser)=>
  {
    var chat = await prisma.chat.findFirst({where:{id:messageRecieved.chat.id}})
     
    chat.memberId.forEach((user)=>{
          if(user===authuser.id) return 

        socket.broadcast.to(user).emit("message recieved",messageRecieved);


    })



  })

  socket.on("typing",(room)=>
  {
    socket.in(room.id).emit("typing recieved");
  })

  socket.on("typing stoped",(room)=>
  {
     socket.broadcast.to(room.id).emit("typing stoped recieved")
  })


  



  



 
})





const port=process.env.port ||3000;
httpServer.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

