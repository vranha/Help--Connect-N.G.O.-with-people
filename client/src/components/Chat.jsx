import { v4 as uuidv4 } from "uuid";

function Chat({ messages, scrollRef }) {
    return (
        <>
            <div className="chat-display">
                {messages.map((message) => (
                    <div ref={scrollRef} key={uuidv4()} >
                        <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                            <div className="content">
                                <p>
                                    {message.message}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Chat;
