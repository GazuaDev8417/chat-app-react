import { createContext, useContext, useEffect, useState, type FC } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from './AuthContext'


const SocketContext = createContext<Socket | null>(null)

const BASE_URL = import.meta.env.VITE_BASE_URL


export const SocketProvider:FC<{ children:React.ReactNode }> = ({ children })=>{
    const { token } = useAuth()
    const [socket, setSocket] = useState<Socket | null>(null)


    useEffect(()=>{
        if(!token){
            setSocket(null)
            return
        }

        const newSocket = io(BASE_URL, {
            auth: { token }
        })

        setSocket(newSocket)

        return () =>{
            newSocket.disconnect()
        }
    }, [token])

    return(
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = ()=>{
    return useContext(SocketContext)
}