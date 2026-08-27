import { useState, type FC, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"



const BASE_URL = import.meta.env.VITE_BASE_URL


const LoginPage:FC = ()=>{
    const [nickname, setNickname] = useState<string>('')
    const { login } = useAuth()
    const navigate = useNavigate()


    const handleSubmit = async(e:FormEvent)=>{
        e.preventDefault()
        if(!nickname.trim()) return

        try{
            let response = await fetch(`${BASE_URL}/login`, {
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname })
            })
            let data = await response.json()
            
            if (response.status === 404) {
                const signupResponse = await fetch(`${BASE_URL}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nickname })
                })

                if(signupResponse.ok){
                    response = await fetch(`${BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nickname })
                });
                data = await response.json();
            } else {
                    const signupData = await signupResponse.json();
                    alert(signupData.error || 'Falha ao cadastrar');
                    return;            
                }
            }

            if (!response.ok) {
                alert(data.error || 'Failed to sign in')   
                return             
            }

            login(data.token, nickname);
            navigate('/chat');
        }catch{
            alert('Server unavailable. Please try again later')
        }
    }

    return(
        <div className="login-wrapper">
            <main className="login-card">
                <h2>Join Chat</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{marginBottom:10}}>
                        <label htmlFor="nickname">Username:{' '}</label>
                        <input
                            type="text"
                            id="nickname"
                            className="input-field"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                            autoFocus/>
                    </div>
                    <button type="submit" className="btn">Sign In</button>
                </form>
            </main>
        </div>
    )
}



export default LoginPage