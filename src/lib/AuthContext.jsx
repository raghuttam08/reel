import { createContext, useContext, useState, useEffect } from 'react'
import api from './api'
import { paymentService } from './payment'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(() => localStorage.getItem('reel_token'))
  const [loading, setLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)
  const [subscriptionPlan, setSubscriptionPlan] = useState(null)

  useEffect(() => {
    if (!token) { setLoading(false); return }
    Promise.all([
      api.me().then(data => setUser(data.user)),
      paymentService.getSubscriptionStatus().then(data => {
        setIsPremium(data.isPremium)
        setSubscriptionPlan(data.plan)
      })
    ])
    .catch(() => {
      localStorage.removeItem('reel_token')
      setToken(null)
    })
    .finally(() => setLoading(false))
  }, [])

  const login = async (username, password) => {
    const data = await api.login(username, password)
    localStorage.setItem('reel_token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  const register = async (username, email, password) => {
    const data = await api.register(username, email, password)
    localStorage.setItem('reel_token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('reel_token')
    setToken(null)
    setUser(null)
    setIsPremium(false)
    setSubscriptionPlan(null)
  }

  const updateSubscription = (plan) => {
    setIsPremium(true)
    setSubscriptionPlan(plan)
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      isPremium,
      subscriptionPlan,
      updateSubscription,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)