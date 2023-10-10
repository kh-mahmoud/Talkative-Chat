import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { UserContext } from '../context/UserProvider';
import axios from 'axios';
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';
import { domain } from '../domain';

const GroupChatModal = ({children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const {fetchAgain } = UserContext();

  
    const { user, chats, setChats } = UserContext();

 
const handleGroup=async(userToadd)=>
    {
        if(selectedUsers.includes(userToadd))
        {
            toast({
                description: 'User already added',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom-left"
                })
                return ;
        }
       setSelectedUsers([...selectedUsers,userToadd])
    }


    const handleDelete=(deluser)=>
    {
        setSelectedUsers(selectedUsers.filter((u)=>u.id!==deluser.id)) 
    }


    const handleSearch=async(query)=>
    {
        if(!query) return 
        try {
             setLoading(true)
             const {data}=await axios.get(`${domain}/api/users?search=${query}`, {
                withCredentials: true,
              })
              setSearchResult(data.users)
              console.log(data)
              setLoading(false)

            } catch (error) {
                console.log(error)
                toast({
                    description: 'Server probleme',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position:"bottom-left"
                    })
                    setLoading(false)
            
        }}

        const handleSubmit=async()=>
        {
            if(!groupChatName || !selectedUsers)
            {
                toast({
                    description:'Please fill all the fields',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position:"bottom-left"
                    })
                    return;
            }
             
            try {
                setLoading(true)
                const {data}=await axios.post(`${domain}/api/chat/group`,{selectedUsers,groupChatName}, {
                    withCredentials: true,
                  })
                  onClose();
                  toast({
                    title: "New Group Chat Created!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                  });
                  fetchAgain()
                  setLoading(false)
                
            } catch (error) {
                console.log(error)
                toast({
                    description: 'Server probleme',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position:"bottom-left"
                    })
                    setLoading(false)
            }
    
        }

  return (
    <div>
        <span onClick={onOpen}>{children}</span>
        <Modal scrollBehavior='inside' isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent="center"
                    >
                        Create Group Chat
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody className='flex flex-col justify-center'>
                    <FormControl>
                        <Input
                        placeholder="Chat Name"
                        mb={3}
                        onChange={(e) => setGroupChatName(e.target.value)}
                    />
                    </FormControl>

                    <FormControl>
                    <Input
                        placeholder="Add Users eg: John, Piyush, Jane"
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    </FormControl>
                    <Box w="100%" display="flex" flexWrap="wrap">
                        {selectedUsers.map((u) => (
                            <UserBadgeItem
                            key={u.id}
                            user={u}
                            handleFunction={() => handleDelete(u)}
                            />
                        ))}
                    </Box>
                    {
                        loading?(
                            <Box className='w-full flex justify-center mt-5'><Spinner/></Box>
                        ):(
                            <Box className='mt-2'>
                              { searchResult?.map((user)=>(
                                    <UserListItem 
                                        key={user.id}
                                        user={user}
                                        handleFunction={()=>handleGroup(user)}
                                        // showSpinner={showSpinner}
                                        // loadingChat={loadingChat} 
                                    />


                                ))}
                            </Box>
                        )
                        }

                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleSubmit} colorScheme="blue">
                        Create Chat
                    </Button>
                </ModalFooter>
                </ModalContent>
        </Modal>
    </div>
  )
}

export default GroupChatModal
