import type { FC } from "react"
import type{ User } from "../types"


interface UserDrawerProps{
    users:User[]
    currentUser:string
    isOpen:boolean
    onSelectUser: (username:string, isMe:boolean) => void
}


const UserDrawer:FC<UserDrawerProps> = ({ users, currentUser, isOpen, onSelectUser})=>{
    return(
        <ul className={`users-drawer ${isOpen ? 'active' : ''}`}>
            {users.map((u)=>{
                const username = typeof u === 'string' ? u : u.user
                const isMe = username === currentUser

                return(
                    <li 
                        key={u.id || username}
                        className={`user-item ${isMe ? 'is-me' : ''}`}
                        onClick={() => onSelectUser(username, isMe)}   
                    >
                        {isMe ? `${username} (you)` : username}
                    </li>
                )
            })}
        </ul>
    )
}


export default UserDrawer