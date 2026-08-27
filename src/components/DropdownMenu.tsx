import { useState, useEffect, useRef, type FC } from "react"


interface DropdownMenuProps{
    onClearMessages: () => void
    onLogout: () => void
}


const DropdownMenu:FC<DropdownMenuProps> = ({ onClearMessages, onLogout })=>{
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)


    useEffect(()=>{
        const handleClickOutside = (event:MouseEvent)=>{
            if(dropdownRef.current && !dropdownRef.current.contains(event.target as Node)){
                setIsOpen(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])


    return(
        <div className="dropdown" ref={dropdownRef}>
            <button className="btn btn-menu" onClick={() => setIsOpen(!isOpen)}>
                <i className="fa-solid fa-bars"></i>
            </button>
            {isOpen && (
                <div className="dropdown-content show">
                    <button className="dropdown-item" onClick={() => { setIsOpen(false); onClearMessages() }}>
                        <i className="fa-solid fa-trash"></i> Clear my messages
                    </button>
                    <button className="dropdown-item danger" onClick={() => { setIsOpen(false); onLogout() }}>
                        <i className="fa-solid fa-right-from-bracket"></i> Sign out
                    </button>
                </div>
            )}
        </div>
    )
}


export default DropdownMenu