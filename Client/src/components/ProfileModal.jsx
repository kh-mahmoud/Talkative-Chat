import { ViewIcon } from '@chakra-ui/icons'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    IconButton,
    Image,
    Text,
  } from '@chakra-ui/react'

const ProfileModal = ({children,user}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      {
        children?(<span onClick={onOpen}>{children}</span>):(
          <IconButton
          display={{base:"flex"}}
          icon={<ViewIcon/>}
          onClick={onOpen}
          />

        )

      }
       
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
             fontSize="40px"
             fontFamily="Work sans"
             justifyContent="center"
             className='flex'
          >
            {user?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
             fontSize="40px"
             fontFamily="Work sans"
             className='flex-col '
          >
            <center>
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user?.pic}
              alt={user?.name}
            />

            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user?.email}
            </Text>
            </center>
       
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  
    </>
  )
}

export default ProfileModal
