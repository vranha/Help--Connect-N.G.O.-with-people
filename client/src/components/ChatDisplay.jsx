import Chat from './Chat'
import ChatInput from './ChatInput'
import axios from 'axios'
import {useState, useEffect} from "react"
import Lottie from 'react-lottie'
import hello from '../assets/hello.json'



const ChatDisplay = ({ user , clickedUser, socket, scrollRef, messages, setMessages, notification, setNotification }) => {
    // const userId = user?.user_id
    // const clickedUserId = clickedUser?.user_id
    // const [clickedUsersMessages, setClickedUsersMessages] = useState(null)

    const getUsersMessages = async () => {

     try {
        const response = await axios.post('http://localhost:8000/api/messages/getmsg', {
            from: user._id,
            to: clickedUser._id,
        })
        console.log(response.data)
     setMessages(response.data)
        } catch (error) {
         console.log(error)
     }
    }

    const defaultOptions = {
        loop: true,
        autoplay: true,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      }


    useEffect( () => {
       getUsersMessages()
    }, [clickedUser])
    



    return (
         <div className={clickedUser ? "chat" : "before-chat" }>
        {clickedUser ?
        <>
            <div className="chat-header">
                <img src={clickedUser?.url} alt="" />
                <h4>{clickedUser?.first_name}</h4>
            </div>
                <Chat messages={messages} scrollRef={scrollRef} />
             </>   
            : <div className="chat-hello">
                <Lottie options={{ animationData: hello, ...defaultOptions }} width={200} height={200} style={{padding: 20}} />
                <h3>Say <span>"hi"</span> to someone...<strong>👋</strong></h3>
                <h4> I'ts time to help!</h4>
            </div> }
        {clickedUser &&
     <ChatInput
         user={user}
         clickedUser={clickedUser} 
         socket={socket}
         messages={messages}
         setMessages={setMessages}
         notification={notification}
          setNotification={setNotification}
         /> }
        </div> 
    )
}

export default ChatDisplay