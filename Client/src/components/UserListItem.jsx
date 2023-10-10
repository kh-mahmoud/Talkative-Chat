import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/react";

const UserListItem = ({ user,handleFunction,handleclick,showSpinner,loadingChat }) => {

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      className="flex relative"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      gap={1}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
      {showSpinner== user.id && loadingChat  &&
        <Box className="absolute right-5">
          <Spinner />
        </Box>
      }
    </Box>
  );
};

export default UserListItem;