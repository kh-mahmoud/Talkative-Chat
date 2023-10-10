import { useEffect, useState } from 'react'
import { Avatar, Box,Button,Input,Text,Tooltip, useDisclosure } from '@chakra-ui/react';
import searchicon from "../assets/icons/searchicon.svg"
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react'

import { useToast } from '@chakra-ui/react'
import { ChevronDownIcon,BellIcon, ChatIcon} from '@chakra-ui/icons'
import { UserContext } from '../context/UserProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {ProfileModal,ChatLoading, UserListItem} from '../components';
import { getSender } from '../config/ChatLogic';
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import { domain } from '../domain';


const SideDrawer = () => {

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { auth,setSelectedChat,chats,setChats,fetchAgain,notification,setNotification} = UserContext();
    const navigate=useNavigate()
    const toast = useToast()
    const [showSpinner, setShowSpinner] = useState();



    //handlesearch

    const handleSearch=async()=>
    {
       if(!search)
       {
         return 
       }

       try{

       setLoading(true)
       // const token = await recaptchaRef.current.executeAsync();
       const {data}=await axios.get(`${domain}/api/users?search=${search}`, {
        withCredentials: true,
      })
        setSearchResult(data.users)
        setLoading(false)

    } catch (error) {
       console.log(error)
       toast({
          description: error.response?.data?.errors[0]?.msg || 'Server probleme',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:"bottom-left"
        })
        setLoading(false)
      }
       
    }

    //access chat

    const accessChat=async(userId)=>
    {
      setLoadingChat(true)
      try {
        setShowSpinner(userId)
         const {data} =await axios.post(`${domain}/api/chat`,{userId},{
          withCredentials:true
         })

         if(!chats.find((c)=>c.id==data.id)) setChats([data,...chats,])

         setLoadingChat(false)
         setSelectedChat(data)
         fetchAgain()
         onClose()

      }  catch (error) {
        console.log(error)
        toast({
           description: error.response?.data?.errors[0]?.msg || 'Server probleme',
           status: 'error',
           duration: 5000,
           isClosable: true,
           position:"bottom-left"
         })
         setLoadingChat(false)
       }

    }

    //logout
   const logout =async()=>
      {
        try {
          const { data } = await axios.get(`${domain}/api/users/logout`, {
            withCredentials: true, // Include cookies in the request
          });
          setSelectedChat("")
          
          if(data)
          {
            navigate("/")
          }

        } catch (error) {
          console.log(error)
        }
      }

  return (
    <Box className='flex'
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="5px"
      >
        <Tooltip hasArrow placement='bottom' label='Search Users to chat'>
           <Button className='w-[180px] max-sm:w-[150px]' onClick={onOpen}>
               <img src={ searchicon} width={18} alt="search" />
                <Text  d={{ base: "none", md: "flex" }} px={4}>
                  Search User
                </Text>
           </Button>
        </Tooltip>

        <Text fontSize="2xl" className='max-sm:hidden' fontFamily="Work sans">
          Talk-A-Tive
        </Text>

        <Box className='flex items-center gap-x-2'>
          <Box className='relative'>
            <Box className="absolute right-[-4px]  z-40">
               <NotificationBadge   effect={Effect.SCALE} count={notification.length}/>
            </Box>
            <Menu  >
              <MenuButton as={Button} p={1}>
                 <ChatIcon fontSize={"lg"}/>
              </MenuButton>
              <MenuList h={`${!notification.length}200px`}>
                  {!notification.length && <Box className='h-full w-full flex justify-center items-center'>There are No Messages</Box> }
                  {notification.map((not,indx)=>(
                      <MenuItem key={indx} onClick={()=>setSelectedChat(not.chat)}>
                           {not.chat.isGroupe?
                           `New Message in ${not.chat.name}`:
                           `New Message from ${getSender(auth.user,not.chat.members)}`}
                      </MenuItem>
                  ))}
              </MenuList>
            </Menu>
          </Box>
           

            <Menu>
              <MenuButton as={Button}  rightIcon={<ChevronDownIcon />}>
                   <Avatar cursor={"pointer"} size={"sm"} name={auth?.user.name} src={auth?.user?.pic}/>
              </MenuButton>
              <MenuList>
                  <ProfileModal user={auth.user}>
                     <MenuItem>My Profile</MenuItem>
                  </ProfileModal>

                <MenuItem onClick={logout}>Logout</MenuItem>
              </MenuList>
            </Menu>
        </Box>

            
     <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
          <DrawerBody>
                <Box className='flex' pb={2}>
                  <Input
                    placeholder="Search by name or email"
                    mr={2}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button onClick={handleSearch}>Go</Button>
                </Box>
                {
                  loading?(
                    <ChatLoading/>
                  ):(
                    <Box className='overflow-auto'>
                        {searchResult?.map((user)=>(
                              <UserListItem 
                                key={user.id}
                                user={user}
                                handleFunction={()=>accessChat(user.id)}
                                showSpinner={showSpinner}
                                loadingChat={loadingChat}
                                
                              />
                        ))}
                    </Box>

                  )
                }
           
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default SideDrawer
