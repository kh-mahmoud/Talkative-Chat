import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { UserContext } from "./context/UserProvider";
import { useState, useEffect } from "react";
import { domain } from "./domain";


export const ProtectRoutes = () => {
  const { setAuth} = UserContext();
  const navigate = useNavigate();
  const [isLoadingDelay, setIsLoadingDelay] = useState(true);

  const { data, isError} = useQuery("auth", () => {
    return axios.get(`${domain}/api/protect`, {
      withCredentials: true,
    });
  });

  useEffect(() => {
    try {
      if (data?.data?.user) {
        // If the query is no longer loading, remove the loading delay
        setAuth(data?.data)
        setIsLoadingDelay(false); // Set isLoadingDelay to false when the query is no longer loading
      }

      if(!isError)
      {
        setIsLoadingDelay(false); // Set isLoadingDelay to false when the query is no longer loading
      }

    } catch (error) {
       console.log(error)
       setIsLoadingDelay(false); // Set isLoadingDelay to false when the query is no longer loading

    }
  
  }, [data,setAuth,isError]);


if(isLoadingDelay)
  {
    return 
  }
 
  if (!data?.data?.user ) {
    navigate("/");
  } else {
    return <Outlet />;
  }
 


};
