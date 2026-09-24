import { api } from './api'

export async function login(usernameOrEmail, password) {
    const loginResult = await api('/auth/login', { 
      method: 'POST', 
      auth: false, 
      body: { usernameOrEmail, password } 
    })
    return loginResult;
}