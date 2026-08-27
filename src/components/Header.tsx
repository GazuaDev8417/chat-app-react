import type { FC } from "react"
import DropdownMenu from "./DropdownMenu"



interface HeaderProps{
    title:string
    onToggleUsers: () => void
    onClearMessages: () => void
    onLogout: () => void
}


const Header:FC<HeaderProps> = ({ title, onToggleUsers, onClearMessages, onLogout })=>{
    return(
        <header className="header">
            <button className="btn btn-users" onClick={onToggleUsers}>
                <i className="fa-solid fa-users"></i>
            </button>
            <h1 style={{fontSize:40}}>{title}</h1>
            <DropdownMenu onClearMessages={onClearMessages} onLogout={onLogout} />
        </header>
    )
}


export default Header