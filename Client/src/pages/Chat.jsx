import axios from 'axios'
import { useEffect, useState } from 'react'
import { UserContext } from '../context/UserProvider';
import { useNavigate } from 'react-router-dom';
import { Box } from "@chakra-ui/react";
import { ChatBox,MyChats,SideDrawer } from '../components';

const Chat = () => {

  // const [chats,setChats]=useState([])
    // const navigate=useNavigate()

    const {selectedChat  } = UserContext();


  // const fetchchats =async()=>
  // {
  //   try {
  //     const { data } = await axios.get('https://talkattive-chat.onrender.com/api/chats', {
  //       withCredentials: true, // Include cookies in the request
  //     });
  //      setChats(data)
  //   } catch (error) {
  //      console.log(error)
  //   }
  // }

  // useEffect(()=>
  // {
  //   fetchchats()
  // },[])





  return (
    <div className='h-auto'>
      <SideDrawer />
    <Box className='flex justify-between  w-full gap-2 h-full p-10'>
        <MyChats  />

        <ChatBox />
       
    </Box>
  </div>
  )
}

export default Chat
