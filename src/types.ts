export interface Messages{
    id?:string
    sender:string
    message:string
    description?:string
    filename?:string
    moment?:Date
}

export interface User{
    id:string
    user:string
}

export interface AuthContextType{
    token:string | null
    username:string | null
    login:(token:string, nickname:string) => void
    logout: () => void
}