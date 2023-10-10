import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";
import {useQuery} from "react-query"



const StateContext = createContext();

export const UserProvider = ({ children }) => {

  const [auth, setAuth] = useState();
  const [selectedChat,setSelectedChat]=useState() 
  const [chats,setChats]=useState([])
  const [fetchAgain,setFetchAgain]=useState(false)
  const [notification,setNotification]=useState([])


  // Declare the isAuth function outside of useEffect





  return (
    <StateContext.Provider value={{auth,setAuth,setSelectedChat,selectedChat,chats,setChats,fetchAgain,setFetchAgain,notification,setNotification }}>
        {children}
    </StateContext.Provider>
  );
};

export const UserContext = () => useContext(StateContext);
