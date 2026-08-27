import { createContext, useContext, useState, type FC } from 'react'
import type { AuthContextType } from '../types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)


export const AuthProvider:FC<{ children: React.ReactNode }> = ({ children })=>{
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
    const [username, ssetUsername] = useState<string | null>(localStorage.getItem('username'))


    const login = (newToken:string, newUsername:string)=>{
        localStorage.setItem('token', newToken)
        localStorage.setItem('username', newUsername)
        setToken(newToken)
        ssetUsername(newUsername)
    }

    const logout = ()=>{
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('privatePartner')
        setToken(null)
        ssetUsername(null)
    }


    return(
        <AuthContext.Provider value={{ token, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = ()=>{
    const context = useContext(AuthContext)
    if(!context){
        throw new Error('useAuth must be used within AuthProvider')
    }

    return context
}