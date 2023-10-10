import React from 'react'
import { UserContext } from '../context/UserProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = () => {

  const { selectedChat } = UserContext();

  return (
      <Box
        display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
        alignItems="center"
        flexDir="column"
        p={3}
        className="max-h-[530px] h-screen relative"
        bg="white"
        w={{ base: "100%" }}
        borderRadius="lg"
        borderWidth="1px"
      >     
        <SingleChat/>
    </Box>
  )
}

export default ChatBox
