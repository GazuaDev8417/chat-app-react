import { useEffect, useRef, type FC } from "react"
import type { Messages } from "../types"


interface MessageListProps{
    messages:Messages[]
    currentUser:string
}



const MessageList:FC<MessageListProps> = ({ messages, currentUser})=>{
    const endRef = useRef<HTMLDivElement>(null)


    useEffect(()=>{
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])


    return(
        <div className="messages-area">
            {messages.map((msg, index)=>{
                const isMe = msg.sender === currentUser
                return(
                    <div key={index} className={`message-bubble ${isMe ? 'sent' : 'received'}`}>
                        <span className="sender-name">{isMe ? 'You' : msg.sender}</span>
                        <p className="message-text">{msg.message}</p>
                    </div>
                )
            })}
            <div ref={endRef}></div>
        </div>
    )
}


export default MessageList