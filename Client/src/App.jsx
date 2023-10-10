import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Chat from './pages/Chat'
import { ProtectRoutes } from './ProtectedRoutes'
import { BlockRoutes } from './BlockedRoutes'


function App() {
  

  return (
    <div className='app'>
      <Routes>
        <Route element={<BlockRoutes />}>

          <Route path='/' element={<Home />} />



        </Route>

        <Route element={<ProtectRoutes />}>

          <Route path='/chats' element={<Chat />} />

        </Route>

      </Routes>





    </div>

  )
}

export default App
