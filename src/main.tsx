import { StrictMode, type FC, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.tsx'
import LoginPage from './pages/LoginPage.tsx'
import ChatPage from './pages/Chatpage.tsx'
import PrivateChatPage from './pages/PrivateChat.tsx'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './index.css'


const ProtectedRoute:FC<{ children:ReactNode }> = ({ children })=>{
  const { token } = useAuth()

  return token ? <>{children}</> : <Navigate to='/' replace />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage/>} />
          
          <Route path='/chat' element={
            <ProtectedRoute>
              <ChatPage/>
            </ProtectedRoute>
          } />

          <Route path='/private' element={
            <ProtectedRoute>
              <PrivateChatPage/>
            </ProtectedRoute>
          } />

          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
