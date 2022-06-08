import ChatHeader from '../components/ChatHeader'
import MatchesDisplay from '../components/MatchesDisplay'
import ChatDisplay from '../components/ChatDisplay'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

import Split from 'react-split'

import { io } from "socket.io-client"

const ChatContainer = ({ user }) => {
    const [ cookies, setCookie, removeCookie ] = useCookies(['user'])
    
    const socket = useRef();
    const scrollRef = useRef()

    const [ clickedUser, setClickedUser ] = useState(null)
    const [messages, setMessages] = useState([])

        let navigate = useNavigate()

        const logout = () => {
            removeCookie('UserId', { path: '/' } )
            removeCookie('AuthToken', { path: '/' } )
            window.location.reload()
        }

    const host = "http://localhost:8000"

    const userId = cookies.UserId

        useEffect(() => {
            if (!userId) {
                navigate("/")
            }
        }, [userId]);
    

    useEffect(() => {
        if (user) {
          socket.current = io(host)
          socket.current.emit("add-user", user._id)
        }
      }, [user]);


    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages]);




    return (
        <>

        {user && <div className="chat-container">
            <ChatHeader user={user} logout={logout} isChat={true}/>
            <Split className="chat-split" sizes={[20, 80]} minSize={100}>
            <MatchesDisplay  matches={user.matches} clickedUser={clickedUser} setClickedUser={setClickedUser}/>

            <ChatDisplay  messages={messages} setMessages={setMessages} user={user} clickedUser={clickedUser} socket={socket} scrollRef={scrollRef}/>
            </Split>
        </div>}
        </>
    )
}

export default ChatContainer