import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import OnBoarding from './pages/OnBoarding'
import ChatContainer from './pages/ChatContainer'
import CardGallery from './pages/CardGallery'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useCookies } from 'react-cookie'
import { io } from "socket.io-client"


const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const userId = cookies.UserId
  const authToken = cookies.AuthToken;

  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(false);

  const socket = useRef();

  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/user', {params: {userId}})

      setUser(response.data)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUser()

}, [cookies])

const host = "http://localhost:8000"

useEffect(() => {
  if (user) {
    socket.current = io(host)   // INDICAR QUE EL REF SOCKET ES EL io(host)
    socket.current.emit("add-user", user._id)
  }
}, [user]);


  return (
     <BrowserRouter>
        <Routes>
        <Route path="*" element={<Navigate replace to="/" />} />
          <Route path="/" element={!authToken ? <Home/> : <Navigate replace to="/dashboard"/>} />
          {/* {authToken && <Route path="/dashboard" element={<Dashboard/>} />}
          {authToken && <Route path="/onboarding" element={<OnBoarding/>} />} */}
          <Route path="/dashboard" >
            <Route index element={<Dashboard user={user} />} />
            <Route path="chat" element={<ChatContainer user={user} socket={socket} notification={notification} setNotification={setNotification} />} />
            <Route path="gallery" element={<CardGallery user={user} setUser={setUser} />} />
          </Route>
          <Route path="/onboarding" element={<OnBoarding/>} />
        </Routes>
     </BrowserRouter>
  )
}

export default App;

