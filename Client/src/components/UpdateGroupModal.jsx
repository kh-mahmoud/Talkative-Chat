import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import { UserContext } from '../context/UserProvider';
import { useState } from 'react';
import UserBadgeItem from './UserBadgeItem';
import axios from 'axios';
import UserListItem from './UserListItem';
import { domain } from '../domain';

const UpdateGroupModal = ({fetchMessages}) => {
    const {auth, selectedChat, setSelectedChat,fetchAgain } = UserContext();

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const toast = useToast();

    const handleRemove = async(user) => {

         if (selectedChat.groupeadmin.find((u)=>u.id!==auth.user.id) && user.id !== auth.user.id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            return;
            }

            try {
                setLoading(true);
           
                const { data } = await axios.put(
                  `${domain}/api/chat/groupremove`,
                  {
                    chatId: selectedChat.id,
                    userId: user.id,
                  },
                  {withCredentials:true}
                );
                fetchAgain()
                auth.user.id === user.id ? setSelectedChat() : setSelectedChat(data);
                fetchAgain()
                fetchMessages()
                onClose
                setLoading(false);

              } catch (error) {
                toast({
                  title: "Error Occured!",
                  description: error.response.data.message,
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                  position: "bottom-left",
                });
                setLoading(false);
              }
              setGroupChatName("");



    }

    const handleRename = async() => {
        if(!groupChatName) return 

        try {
             setRenameLoading(true)
             const {data}=await axios.put(`${domain}/api/chat/rename`,{name:groupChatName,chatId:selectedChat.id},{
                withCredentials:true
             })
             if(data)
             {
                toast({
                    title: "Rename Groupe",
                    description: "Group name updated succefuly",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                  });
             }
             setSelectedChat(data)
             setRenameLoading(false)
             fetchAgain()


       } catch (error) {
           toast({
               title: "Error Occured!",
               description: error.response.data.message,
               status: "error",
               duration: 5000,
               isClosable: true,
               position: "bottom-left",
             });
             setRenameLoading(false);
       }
       setGroupChatName("")

    }

    const handleSearch = async (query) => {
        if (!query) return
        try {
            setLoading(true)
            const { data } = await axios.get(`${domain}/api/users?search=${query}`, {
                withCredentials: true,
            })
            setSearchResult(data.users)
            setLoading(false)

        } catch (error) {
            console.log(error)
            toast({
                description: 'Server probleme',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
            setLoading(false)

        }
    }

    const handleAddUser=async(user)=>
    {
        
       if(selectedChat.members.find((u)=>u.id === user.id))
       {
        toast({
            description: 'User already in group! ',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: "bottom-left"
        }) 
        return 
       }

       if(selectedChat.groupeadmin.find((u)=>u.id!==auth.user.id))
       {
        toast({
            description: 'Only Admins can add users ! ',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: "bottom-left"
        }) 
        return 
       }

       try {
          setLoading(true)
          const {data}=await axios.put("${domain}/api/chat/groupadd",{userId:user.id,chatId:selectedChat.id},{
            withCredentials:true
          })
          setSelectedChat(data)
          setLoading(false)
          fetchAgain()

       } catch (error) {
        console.log(error)
        toast({
            description: 'Server probleme',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: "bottom-left"
        })
        setLoading(false)
       }

    }
    



    return (
        <div>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal scrollBehavior='inside' isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            {selectedChat?.members?.map((u) => (
                                <UserBadgeItem
                                    key={u.id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>

                        <FormControl display="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameloading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>

                        <FormControl>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {
                            loading ? (
                                <Box className='w-full flex justify-center mt-5'><Spinner /></Box>
                            ) : (
                                <Box className='mt-2'>
                                    {searchResult?.map((user) => (
                                        <UserListItem
                                            key={user.id}
                                            user={user}
                                            handleFunction={() => handleAddUser(user)}
                                        // showSpinner={showSpinner}
                                        // loadingChat={loadingChat} 
                                        />


                                    ))}
                                </Box>
                            )
                        }

                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => handleRemove(auth.user)} colorScheme="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default UpdateGroupModal
