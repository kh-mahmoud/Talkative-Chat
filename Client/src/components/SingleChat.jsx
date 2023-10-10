import { UserContext } from '../context/UserProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon} from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogic';
import ProfileModal from './ProfileModal';
import UpdateGroupModal from './UpdateGroupModal';
import { useEffect, useState } from 'react';
import axios from "axios"
import ScrollableChat from './ScrollableChat';
import {io} from "socket.io-client"
import { domain } from '../domain';




const SingleChat = () => {
    const { auth, selectedChat, setSelectedChat,notification,setNotification,fetchAgain } = UserContext();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [typingTimeout, settypingTimeout] = useState(false);

    const toast = useToast();
    const ENDPOINT = `${domain}`; 
    const [socket,setSocket]=useState(io(ENDPOINT))
    const [state,setState]=useState(false)




    useEffect(()=>{
           socket.emit("setup",auth.user)
           socket.on("connection",()=> setSocketConnected(true))
           
           return () => {
            socket.off("connection");
            socket.off("setup")
          };
    },[])



    useEffect(()=>
    {
       setState(false)
    },[messages])


    

  

    const fetchMessages = async () => {
        if (!selectedChat) return;
    
        try {
    
          setLoading(true);
    
          const { data } = await axios.get(`${domain}/api/message/${selectedChat.id}`,{
                withCredentials:true
            }
          );
          setMessages(data);
          setLoading(false);

          socket?.emit("join chat",selectedChat.id)
    
        } catch (error) {
            console.log(error)
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Messages",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      };



      useEffect(()=>
      {
          fetchMessages()
      },[selectedChat])


      useEffect(() => {
        socket?.on("message recieved", (newMessage) => {

            if (!selectedChat?.id || selectedChat.id !== newMessage.chat.id) {
                if(!notification.includes(newMessage))
                {
                    setNotification([newMessage,...notification])
                    fetchAgain()
                }
              } else {
                setMessages([...messages,newMessage]);
              }});

        socket?.on("typing recieved",()=>
        {
            if (!selectedChat) return 
            setIsTyping(true) 

        })

        socket?.on("typing stoped recieved",()=>
        {
            setIsTyping(false)
        })

        return () => {
            socket.off("message recieved");
            socket.off("typing recieved");
            socket.off("typing stoped recieved");

          };
      });

const sendMessage=async(e)=>
    {
        if(!newMessage) return
        if(e.key===("Enter") && newMessage)
        {
            const message={
                chat:{id:selectedChat.id,
                    isGroupe:selectedChat.isGroupe,
                    name:selectedChat.name,
                    members:selectedChat.members},
                content:newMessage,
                sender:{name:auth.user.name,
                        pic:auth.user.pic,
                        id:auth.user.id},
                createdAt:new Date(),
                latestmessage:{
                    content: newMessage,
                    createdAt:new Date(),
                    sender:{
                        name:auth.user.name
                    }
                }           
            }
            socket?.emit("new message",message,auth?.user)
            setMessages([...messages,message]);
            setNewMessage("")

             try {
                const {data}=await axios.post(`${domain}/api/message`,{content:newMessage,chatId:selectedChat.id},{
                    withCredentials:true
                })
                if(data) setState(true)
               

             } catch (error) {
                 toast({
                        title: "Error Occured!",
                        description: "Failed to Load the Messages",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom-left",
                    });
                    setLoading(false)
             }
        }
    }


    const typingHandler=(e)=>
    {
      setNewMessage(e.target.value)
      socket?.emit("typing",selectedChat)
      if(typingTimeout) clearTimeout(typingTimeout)

      settypingTimeout(setTimeout(() => {
        socket?.emit("typing stoped",selectedChat)
    }, 1000)) 
    
    }

    




    return (
        <div className='h-full w-full overflow-auto   '>
            {selectedChat ? (
                <Box className='flex flex-col h-full relative'>

                    <Box
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        className='sticky bg-white top-0'
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            d={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        <Box className='flex justify-start max-sm:justify-center ml-2 flex-1'>
                            {
                                !selectedChat.isGroupe ? (
                                    <>
                                        {getSender(auth?.user, selectedChat?.members)}
                                    </>
                                ) : (
                                    <>
                                        <Box fontSize={"Work sans"} className=''> {selectedChat.name}</Box>
                                    </>
                                )
                            }
                        </Box>
                        <Box>
                            {
                                !selectedChat.isGroupe ? (
                                    <>
                                         <ProfileModal user={getSenderFull(auth?.user, selectedChat?.members)} />
                                    </>
                                ) : (
                                    <>
                                        <UpdateGroupModal fetchMessages={fetchMessages} />
                                    </>
                                )
                            }

                        </Box>
                    </Box>
                  
                    <Box
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        className='flex flex-col justify-start h-full'
                        borderRadius="lg"
                        overflow={"auto"}
                    >
                        {loading?(
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                margin="auto"
                                />
                        ):
                        (
                       <>     
                         <Box className='messages overflow-scroll flex-grow scrollbar-hide relative'>
                            <ScrollableChat istyping={istyping} state={state} messages={messages}/>
                         </Box>
                           <Box className='flex items-center gap-x-1'>
                           <FormControl
                                onKeyDown={sendMessage}
                                id="first-name"
                                isRequired
                                mt={3}
                            >
                            <Box className='flex items-center'>
                                    <Input
                                        bg="white"
                                        placeholder="Enter a message.."
                                        value={newMessage}
                                        onChange={typingHandler}
                                    />
                             </Box>
                             

                            </FormControl>

                            {/* <IconButton onClick={()=>{sendMessage();typingHandler()}} bg={"#38B2AC"} _hover={{background:'#38B2AC'}} className='mt-3'  size={"lg"} icon={<ArrowForwardIcon/>}/> */}
                        </Box>
                        </>
                         
                        )}

                        
                       

                     

                    </Box>
                </Box>
            ) : (

                <Box  display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )



            }
        </div>
    )
}

export default SingleChat
