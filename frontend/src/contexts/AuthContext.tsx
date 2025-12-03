import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { login, register, AuthResponse } from '../services/api'

interface AuthContextType {
  user: { username: string; nickname: string; userId: number } | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string, nickname: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<{ username: string; nickname: string; userId: number } | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogin = async (username: string, password: string) => {
    const response: AuthResponse = await login(username, password)
    setToken(response.token)
    setUser({
      username: response.username,
      nickname: response.nickname,
      userId: response.userId
    })
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify({
      username: response.username,
      nickname: response.nickname,
      userId: response.userId
    }))
  }

  const handleRegister = async (username: string, password: string, nickname: string) => {
    const response: AuthResponse = await register(username, password, nickname)
    setToken(response.token)
    setUser({
      username: response.username,
      nickname: response.nickname,
      userId: response.userId
    })
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify({
      username: response.username,
      nickname: response.nickname,
      userId: response.userId
    }))
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}




