import { Avatar, AvatarGroup, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { UserContext } from "../context/UserProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogic";
import GroupChatModal from "./GroupChatModal";
import { useQuery } from "react-query";
import moment from "moment";
import {io} from "socket.io-client"
import { domain } from "../domain";



const MyChats = () => {
  const { auth, setSelectedChat,selectedChat , setChats,setFetchAgain,fetchAgain } = UserContext();
  const toast = useToast();
  const ENDPOINT = `${domain}`;
  const [socket,setSocket]=useState(io(ENDPOINT))
  const [dok,setdok]=useState()


  useEffect(()=>{
         socket.emit("setup",auth.user)
         
         return () => {
          socket.off("connection");
          socket.off("setup")
        };
  },[])


  const { data, isLoading, isError, refetch } = useQuery("chats", () => {
    return axios.get(`${domain}/api/chat`, {
      withCredentials: true,
    });
  });

 console.log(dok)
useEffect(() => {
  socket?.on("message recieved", (newMessage) => {
     refetch()
     setdok(newMessage)
  });

  return () => {
    socket.off("message recieved");

  };
});

  // Move the state updates to a useEffect
  useEffect(() => {
    if (!isLoading) {
      setChats(data.data);
      setFetchAgain(() => refetch);
      refetch()
    }
    if (isError) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }, [isLoading, isError, data, setChats, toast,setFetchAgain,refetch,fetchAgain,dok]);

  const formatTimestamp = (timestamp) => {
    return moment(timestamp).fromNow(); // Format the timestamp as a relative time (e.g., "2 minutes ago")
  };


  return (
    <Box
    display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
    flexDir="column"
    alignItems="center"
    p={3}
    className="max-h-[530px] h-screen"
    bg="white"
    w={{ base: "100%", md: "40%" }}
    borderRadius="lg"
    borderWidth="1px"
    overflow={"auto"}
  >
     <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        className="flex gap-2 flex-wrap justify-center "
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <span >My Chats</span>
        <GroupChatModal>
            <Button
                display="flex"
                fontSize={"17px"}
                rightIcon={<AddIcon />}
              >
                New Group Chat
            </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {isLoading?(<ChatLoading/>):
          <Stack overflow={'auto'}>
            {
              data.data?.map((chat,i)=>
              (
                <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                className="transition ease-in-out delay-150 overflow-hidden whitespace-nowrap"
                bg={selectedChat?.id === chat?.id ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat?.id === chat?.id ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={i}
              >
                <Box className="flex items-center gap-x-3">
                  {chat.isGroupe?
                    (
                      <AvatarGroup max={2} size='sm'>
                      {chat.members.map((user)=>(
                        <Avatar key={user.id} name={user.name} src={user.pic} />
                      ))}
                      </AvatarGroup>

                    ):
                    (<Avatar size={"sm"} name={getSender(auth?.user, chat.members)} src={chat.members[0].id!==auth.user.id ? chat.members[0].pic:chat.members[1].pic} />)
                  }
                  <Box className="flex flex-col w-full">

                    <Box  fontFamily={"revert-layer"}>
                      {!chat.isGroupe
                        ? getSender(auth?.user, chat.members)
                        : chat.name}
                    </Box>

                    {chat.latestmessage && (
                      chat.id===dok?.chat.id&&dok?(
                      <Box className="flex gap-x-1">
                        <Box fontSize={"15px"} fontWeight={600} className="truncate ... max-w-[100px]">{dok?.latestmessage?.sender.id===auth.user.id?'you':dok?.latestmessage?.sender.name} :</Box>
                        <Box className="truncate ... max-w-[100px]">{dok?.latestmessage?.content}</Box>
                        <Box className="flex flex-grow justify-end">{formatTimestamp(dok?.latestmessage?.createdAt)} </Box>
                      </Box>
                      ):(
                        <Box className="flex gap-x-1 items-center">
                          <Box fontSize={"15px"} fontWeight={600} className="truncate ... max-w-[100px]">{chat?.latestmessage?.sender.id===auth.user.id?'you':chat?.latestmessage?.sender.name} :</Box>
                          <Box  fontSize={"15px"} className="truncate ... max-w-[100px]">{chat.latestmessage?.content}</Box>
                          <Box className="flex flex-grow justify-end">{formatTimestamp(chat.latestmessage?.createdAt)} </Box>
                       </Box>
                      )
                    
                    )
                    }
                  </Box>
                
                </Box>
               

              </Box>
              ))
            }
           
          </Stack>
        
        }

      </Box>


  </Box>
  )
}

export default MyChats
