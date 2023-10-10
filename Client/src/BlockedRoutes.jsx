import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { domain } from "./domain";

export const BlockRoutes = () => {

   const [auth,setAuth]=useState()
   const [isLoadingDelay, setIsLoadingDelay] = useState(true);

  const navigate = useNavigate();

  const isAuth = async () => {
    try {
      const { data } = await axios.get(`${domain}/api/block`, {
        withCredentials: true,
      });
      
      if(data?.user)
      {
        setIsLoadingDelay(false)
        setAuth(data)

      }
     
    } catch (error) {
      // Handle the error (e.g., display an error message or redirect to the login page)
      setIsLoadingDelay(false)
      
    }
  };

  useEffect(() => {
    isAuth();
  }, []);

  if (isLoadingDelay) {
    return 
  }else
  {
    if (auth?.user) {
      navigate("/chats");
    }
    else
    {
      return <Outlet/>
    }
  }

  


};
