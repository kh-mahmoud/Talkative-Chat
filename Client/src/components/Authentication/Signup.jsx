import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack,useToast} from "@chakra-ui/react"
import { useState } from "react"
import axios from "axios"
import {  useNavigate } from 'react-router-dom';
import { domain } from "../../domain";



const Signup = () => {
    const [show, setShow] = useState(false)
    const [name,setName]=useState()
    const [email,setEmail]=useState()
    const [confirmpassword,setConfirmpassword]=useState()
    const [password,setPassword]=useState()
    const [pic,setPic]=useState()
    const [loading,setLoading]=useState(false)
    const toast = useToast()
    const navigate=useNavigate()
    const [progress,setprogress]=useState({start:false,pc:0})
    
    axios.defaults.withCredentials = true;

  

    const postDetails =async(pic)=>
    {
        setLoading(true)
        if(!pic)
        {
         toast({
            title: 'Account created.',
            description: "Please Select an Image!",
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position:"bottom-left"
          })
          return
        }
        if(pic.type==="image/jpeg"|| pic.type==="image/png")
        {
         const data = new FormData()
         data.append("file",pic)
         data.append("upload_preset","chat app")
         data.append("cloud_name","domark")

         try {
            setprogress((prev)=>{return {...prev,start:true}})

            const response = await axios.post("https://api.cloudinary.com/v1_1/domark/image/upload", data, {
               withCredentials: false, // Include credentials with the request
               onUploadProgress: (progressEvent) => {
                 setprogress((prev) => ({ ...prev, pc: progressEvent.loaded / progressEvent.total * 100 }));
               },
             });
             
            // console.log(response)
            setPic(response.data.url)
            setLoading(false)
         } catch (error) {
            console.log(error)
            setLoading(false)
            
         }
      }else{
         toast({
            description: "Please Select an Image!",
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position:"bottom-left"
          })
          return
      }
       }


    const submitHandler=async()=>
    {
        if(!name || !email || !password || !confirmpassword )
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

        if(password !== confirmpassword)
        {
         toast({
            description: "Password Do Not Match",
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
         const {data}=await axios.post(`${domain}/api/users/signup`,{password,email,pic,name},{headers: {'Content-Type': 'application/json'}})
            toast({
               description: "Registration Succefull",
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
        <VStack  spacing={'5px'}>

             <FormControl id="firstname" isRequired>
                <FormLabel>Name  </FormLabel>
                <Input placeholder="Enter Your Name" onChange={(e)=>setName(e.target.value)} />
             </FormControl> 

             <FormControl id="email" isRequired>
                <FormLabel>Email </FormLabel>
                <Input placeholder="Enter Your Email" onChange={(e)=>setEmail(e.target.value)} />
             </FormControl> 

             <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                   <Input type={show?"text":"password"} placeholder="Enter Your Password" onChange={(e)=>setPassword(e.target.value)} />
                   <InputRightElement width={"4.5rem"}>
                      <Button h={"1.75rem"} size={"sm"} onClick={()=>setShow((prev)=>!prev)}>
                          {show?"Hide":"Show"}
                      </Button>
                   
                   </InputRightElement>
                </InputGroup>
             </FormControl> 

             <FormControl id="password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                   <Input type={show?"text":"password"} placeholder="Enter Your Password" onChange={(e)=>setConfirmpassword(e.target.value)} />
                </InputGroup>
             </FormControl> 

                <FormControl id="pic" isRequired>
                  <FormLabel>Upload your Picture</FormLabel>
                   <Input disabled={loading?true:false}  p={1.5} type="file" accept="image/*" onChange={(e)=>postDetails(e.target.files[0])} />    
                </FormControl> 
                {progress.start&& <progress value={progress.pc} />}

             <Button isLoading={loading} onClick={submitHandler}  width={"100%"} className='mt-5' colorScheme="blue">
                    Sign Up
             </Button> 
        </VStack>
    </div>
  )
}

export default Signup
