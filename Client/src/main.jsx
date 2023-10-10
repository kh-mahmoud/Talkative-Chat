import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import {BrowserRouter} from "react-router-dom"
import { UserProvider } from './context/UserProvider.jsx'
import {QueryClientProvider,QueryClient} from "react-query"

const queryclient= new QueryClient()


ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
     <QueryClientProvider client={queryclient}>
        <UserProvider>
            <ChakraProvider>
              <BrowserRouter>
                    <App />
              </BrowserRouter>
            </ChakraProvider>
        </UserProvider>
    </QueryClientProvider>

  </React.StrictMode>,
)
