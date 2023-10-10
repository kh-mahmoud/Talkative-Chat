import { useState,useRef } from "react"
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack ,useToast} from "@chakra-ui/react"
import axios from "axios"
import {  useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import { domain } from "../../domain";


const Login = () => {


   
    const [show, setShow] = useState(false)
    const [email,setEmail]=useState()
    const [password,setPassword]=useState()
    const [loading,setLoading]=useState(false)
    const toast = useToast()
    const navigate=useNavigate()
    axios.defaults.withCredentials = true;

   //  const recaptchaRef = useRef(null);

    const submitHandler=async()=>
    {
      if(!email || !password)
      {
       toast({
          description: "Pleas Fill all Fields",
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:"bottom-left"
        })
        setLoading(false)
        return
      }

      try {
         setLoading(true)
         // const token = await recaptchaRef.current.executeAsync();
         const {data}=await axios.post(`${domain}/api/users/signin`,{password,email},{headers: {'Content-Type': 'application/json'}})
            toast({
               description: "Login Succefull",
               status: 'success',
               duration: 5000,
               isClosable: true,
               position:"bottom-left"
             })
                   
         // localStorage.setItem("userInfo",JSON.stringify(data))
         setLoading(false)
         navigate("/chats",{replace:true})



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

  
  

  return (
    <div>
        <VStack>
             <FormControl id="email" isRequired>
                <FormLabel>Email </FormLabel>
                <Input value={email} placeholder="Enter Your Email" onChange={(e)=>setEmail(e.target.value)} />
             </FormControl> 

             <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                   <Input value={password} type={show?"text":"password"} placeholder="Enter Your Password" onChange={(e)=>setPassword(e.target.value)} />
                   <InputRightElement width={"4.5rem"}>
                      <Button h={"1.75rem"} size={"sm"} onClick={()=>setShow((prev)=>!prev)}>
                          {show?"Hide":"Show"}
                      </Button>
                   
                   </InputRightElement>
                </InputGroup>
             </FormControl>
             <div className="flex justify-center items-center">
             {/* <ReCAPTCHA
                  sitekey={import.meta.env.VITE_CLE_SITE}
                  size="invisible"
                  badge="bottomright"
                  ref={recaptchaRef}

               /> */}
            </div>
             <Button isLoading={loading} onClick={submitHandler}  width={"100%"} className='mt-5' colorScheme="blue">
                    Login
             </Button> 
             <Button
               onClick={()=>{
                  setEmail("guest@example.com");
                  setPassword("123456")
               }}
               width={"100%"}
               colorScheme="red">
                    Get Ghest User Credentials
             </Button> 
        </VStack>
       
        
    </div>
  )
}

export default Login
