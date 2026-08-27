import type { FC } from "react"

interface DeleteAccountModalProps{
    isOpen:boolean
    onClose: () => void
    onConfirm: () => void
}


const DeleteAccountModal:FC<DeleteAccountModalProps> = ({ isOpen, onClose, onConfirm })=>{
    if(!isOpen) return null


    return(
        <div className="modal active" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Delete Account</h3>
                <p>Are you sure you want to  permanently delete your account?</p>
                <p className="warning-text">
                    This action cannot be undone and your complete message history will be removed.
                </p>
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-danger" onClick={onConfirm}>Yes, delete my account</button>
                </div>
            </div>
        </div>
    )
}


export default DeleteAccountModal