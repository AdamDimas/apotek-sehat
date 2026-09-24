/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import { login as loginApi } from '../services/authService'
import { clearToken } from '../services/api'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

const readUser = () => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)

  const login = async (usernameOrEmail, password) => {
    const u = await loginApi(usernameOrEmail, password)
    localStorage.setItem('user', JSON.stringify(u))
    setUser(u)
    return u
  }
  
  const logout = () => {
    clearToken(); localStorage.removeItem('user'); setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}