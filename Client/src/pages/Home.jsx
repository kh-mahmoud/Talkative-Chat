import {Container,Box,Text, Tabs, TabList, Tab, TabPanel, TabPanels, useStatStyles} from "@chakra-ui/react"
import Login from "../components/Authentication/Login"
import Signup from "../components/Authentication/Signup"
import '../App.css'

const Home = () => {



  return (
    <Container centerContent maxW={"xl"}>
        <Box  m={"40px 0px 15px 0px"} className="flex justify-center bg-[white] w-full rounded-md">
            <Text fontSize={"4xl"} fontFamily={"Work sans"}>Codex-Talk</Text>
        </Box>
        <Box className="bg-[white] w-full p-4">
            <Tabs variant={"soft-rounded"}>
              <TabList width={"100%"}>
                  <Tab width={"50%"}>Login</Tab>
                  <Tab width={"50%"}>Signup</Tab>
              </TabList>
              <TabPanels>

                  <TabPanel><Login/></TabPanel>
                  <TabPanel><Signup/></TabPanel>

              </TabPanels>

            </Tabs>
        </Box>
    </Container>
  )
}

export default Home
