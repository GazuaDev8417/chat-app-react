import { useEffect, useState } from "react"
import { io, Socket } from 'socket.io-client'


const BASE_URL = import.meta.env.VITE_BASE_URL


export const useSocket = ():Socket | null =>{
    const [socket, setSocket] = useState<Socket | null>(null)


    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(!token) return

        const newSocket = io(BASE_URL, {
            auth: { token }
        })

        setSocket(newSocket)

        return ()=>{
            newSocket.disconnect()
        }
    }, [])


    return socket
}