import { useEffect, useState} from 'react'
import axios from 'axios'
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";


const ChatInput = ({ user, clickedUser, socket, messages, setMessages, notification, setNotification, scrollRef, getUserMessages, getClickedUsersMessages }) => {
    const [textArea, setTextArea] = useState("")
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    

    const userId = user?.user_id
    const clickedUserId = clickedUser?.user_id

    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
      };

    const handleEmojiClick = (event, emojiObject) => {
        let message = textArea;
        message += emojiObject.emoji;
        setTextArea(message);
      };

    const addMessage = async () => {

        try {
            await axios.post('http://localhost:8000/api/messages/addmsg', { 
                from: user._id,
                to: clickedUser._id,
                message: textArea 
            })
            socket.current.emit("send-msg", {
                from: user._id,
                to: clickedUser._id,
                message: textArea 
            })

            const msgs = [...messages];
            msgs.push({ fromSelf: true, message: textArea})
            setMessages(msgs)

            // getUserMessages()
            // getClickedUsersMessages()
            setTextArea("")
            setShowEmojiPicker(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (messageData) => {
                setArrivalMessage({fromSelf:false, message: messageData})
      
            })
        }
    }, []);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage]);


    return (
        <div className="chat-input">
            <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
            <div className="input-container">
                <input
                          type="text"
                          placeholder="type your message here"
                          onChange={(e) => setTextArea(e.target.value)}
                          value={textArea}
                          onClick={() => setShowEmojiPicker(false)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                addMessage()
                            }
                        }}
                        />
                <button 
                onClick={addMessage}  
                ><IoMdSend /></button>
            </div>
        </div>
    )
}

export default ChatInput
