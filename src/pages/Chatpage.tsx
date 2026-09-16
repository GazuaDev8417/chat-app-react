import { useState, useEffect, type FC, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useSocket } from "../context/SocketContext"
import Header from "../components/Header"
import MessageList from "../components/MessageList"
import UserDrawer from "../components/UserDrawer"
import DeleteAccountModal from "../components/DeleteAccountModal"
import type { Messages, User } from '../types'



const BASE_URL = import.meta.env.VITE_BASE_URL



const ChatPage:FC = ()=>{
    const { token, username, logout }  = useAuth()
    const socket = useSocket()
    const navigate = useNavigate()
    const [messages, setMessages] = useState<Messages[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [inputMessage, setInputMessage] = useState<string>('')
    const [isUsersOpen, setIsUsersOpen] = useState<boolean>(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)


    useEffect(()=>{
        if(!socket) return

        //socket.on('messages:history', (history:Messages[]) => setMessages(history))
        const handlePublicHistory = (history: Messages[]) => {
            setMessages(history);
        };

        socket.on('public:history', handlePublicHistory);
        socket.emit('public:history:request')
        
        socket.on('message:received', (msg:Messages) => setMessages((prev) => [...prev, msg]))
        
        socket.on('users:list', (usersList:User[]) => setUsers(usersList))
        socket.emit('users:list:request');
        

        // socket.on('private:request_received', ({ sender }: { sender:string })=>{
        //     if(window.confirm(`${sender} wants to start a private chat with you. Accept?`)){
        //         sessionStorage.setItem('privatePartner', sender)
        //         socket.emit('private:accept', { sender })
        //         navigate('/private')
        //     }
        // })

        const handlePrivateRequest = ({ sender }: { sender:string})=>{
            console.log('PRIVATE REQUEST RECEIVED ON CLIENT:', {
                currentUser: username,
                sender
            });

            const accepted = window.confirm(
                `${sender} wants to start a private chat with you. Accept?`
            );

            console.log('PRIVATE REQUEST ANSWER:', { accepted });

            if(accepted){
                sessionStorage.setItem('privatePartner', sender);
                socket.emit('private:accept', { sender });
                navigate('/private')
            }
        }

        socket.on('private:request_received', handlePrivateRequest)

        // socket.on('private:started', ({ partner }: { partner:string })=>{
        //     sessionStorage.setItem('privatePartner', partner)
        //     navigate('/private')
        // })

        const handlePrivateStarted = ({ partner }: { partner: string }) => {
            console.log('PRIVATE CHAT STARTED ON CLIENT:', {
                currentUser: username,
                partner
            });

            sessionStorage.setItem('privatePartner', partner);
            navigate('/private');
        };

        socket.on('private:started', handlePrivateStarted);

        socket.on('private:error', (errorMsg:string)=>{
            alert(errorMsg)
        })

        return ()=>{
            socket.off('public:history', handlePublicHistory)
            socket.off('message:received')
            socket.off('users:list')
            socket.off('private:request_received', handlePrivateRequest)
            socket.off('private:started', handlePrivateStarted)
            socket.off('private:error')
        }
    }, [socket, navigate])


    const handleSendMessage = (e:FormEvent)=>{
        e.preventDefault()
        if(!inputMessage.trim() || !socket) return

        socket.emit('message:send', { message: inputMessage })
        setInputMessage('')
    }


    const deleteUserMessage = async():Promise<boolean>=>{
        try{
            const response = await fetch(`${BASE_URL}/messages`, {
                method:'DELETE',
                headers: { Authorization: token || '' }
            })

            if(response.ok){
                setMessages((prev) => prev.filter((m) => m.sender !== username))
                return true
            }

            const errorData = await response.json().catch(() => null)
            console.error('API Error Response: ', errorData)
            return false
        }catch{
            return false
        }    
    }


    const handleClearMyMessages = async()=>{
        if(!window.confirm('Are you sure you want to clear you messages from this view')) return
        
        const ok = await deleteUserMessage()
        alert(ok ? `Messages sent by ${username} deleted successfully` : 'Failed to delete messages') 
    }


    const handleLogout = async()=>{
        if(window.confirm('Are you sure you want to sign out? Your messages will be removed from the chat')){
            await deleteUserMessage()
            logout()
            navigate('/')
        }
    }


    const handleConfirmDeleteAccount = async()=>{
        try{
            const response = await fetch(`${BASE_URL}/user/account`, {
                method:'DELETE',
                headers: { Authorization: token || '' }
            })

            if(response.ok){
                alert('Your account has been deleted successfully')
                logout()
                navigate('/')
            }else{
                const data = await response.json()
                alert(`Failed to delete account: ${data.error || 'Operation failed'}`)
            }
        }catch{
            alert('Error connecting to the server')
        }finally{
            setIsDeleteModalOpen(false)
        }
    }


    const handleSelectUser = (targetUsername:string, isMe:boolean)=>{
        if(isMe){
            setIsDeleteModalOpen(true)
            return
        }

        console.log('PRIVATE REQUEST CLICK:', {
            targetUsername,
            socketExists: Boolean(socket),
            connected: socket?.connected
        })
        
        if(socket){
            socket.emit('private:request', { recipient: targetUsername })
        }
    }


    return(
        <>
            <Header
                title={username || 'Public Chat'}
                onToggleUsers={() => setIsUsersOpen(!isUsersOpen)}
                onClearMessages={handleClearMyMessages}
                onLogout={handleLogout}/>
            
            <UserDrawer
                users={users}
                currentUser={username || ''}
                isOpen={isUsersOpen}
                onSelectUser={handleSelectUser}/>
            
            <main className="chat-container">
                <MessageList messages={messages} currentUser={username || ''} />

                <form className="form-container" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Type a message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        required/>
                    <button type="submit" className="btn">Send</button>
                </form>
            </main>

            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDeleteAccount}/>
        </>
    )
}


export default ChatPage