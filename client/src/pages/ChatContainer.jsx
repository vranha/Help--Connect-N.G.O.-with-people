import ChatHeader from '../components/ChatHeader'
import MatchesDisplay from '../components/MatchesDisplay'
import ChatDisplay from '../components/ChatDisplay'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

import Split from 'react-split'


const ChatContainer = ({ user, notification, setNotification, socket }) => {
    const [ cookies, setCookie, removeCookie ] = useCookies(['user'])

    const scrollRef = useRef()

    const [ clickedUser, setClickedUser ] = useState(null)
    const [messages, setMessages] = useState([])

        let navigate = useNavigate()

        const logout = () => {
            removeCookie('UserId', { path: '/' } )
            removeCookie('AuthToken', { path: '/' } )
            window.location.reload()
        }

    const userId = cookies.UserId

        useEffect(() => {
            if (!userId) {
                navigate("/")
            }
        }, [userId]);

        // useEffect(() => {
            
        //     socketNotification()
            
            
            
        // }, [socket]);
        
        // const socketNotification = async () => {
        //     await socket.current?.on("notification", (data) => {
        //         setNotification(true)
        //         console.log(notification)
        //         console.log(socket.current)
        //     })
        //   }


    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages]);




    return (
        <>

        {user && <div className="chat-container">
            <ChatHeader socket={socket} user={user} logout={logout} isChat={true}/>
            <Split className="chat-split" sizes={[20, 80]} minSize={100}>
            <MatchesDisplay  matches={user.matches} clickedUser={clickedUser} setClickedUser={setClickedUser} notification={notification} setNotification={setNotification}/>

            <ChatDisplay messages={messages} setMessages={setMessages} user={user} clickedUser={clickedUser} socket={socket} scrollRef={scrollRef} notification={notification} setNotification={setNotification}/>
            </Split>
        </div>}
        </>
    )
}

export default ChatContainer