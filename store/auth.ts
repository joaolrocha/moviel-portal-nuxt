import { defineStore } from 'pinia'
import { useFavoritesStore } from './favorites'

// Types para autenticação
interface User {
  id: number
  name: string
  email: string
  avatar?: string
  preferences: {
    language: string
    theme: 'light' | 'dark'
    notifications: boolean
  }
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  loginAttempts: number
  lastLoginAt: Date | null
}

// Mock users para simulação
const MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    preferences: {
      language: 'pt-BR',
      theme: 'light',
      notifications: true
    }
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@email.com', 
    avatar: 'https://i.pravatar.cc/150?img=2',
    preferences: {
      language: 'pt-BR',
      theme: 'dark',
      notifications: false
    }
  }
]

export const useAuthStore = defineStore('auth', {
  // 🏗️ STATE - Authentication State
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    loginAttempts: 0,
    lastLoginAt: null
  }),

  // 🧮 GETTERS - Computed Properties
  getters: {
    // Usuário logado
    currentUser: (state): User | null => state.user,
    
    // Verifica se está autenticado
    isLoggedIn: (state): boolean => state.isAuthenticated && !!state.token,
    
    // Nome do usuário ou 'Visitante'
    displayName: (state): string => state.user?.name || 'Visitante',
    
    // Avatar do usuário
    userAvatar: (state): string => state.user?.avatar || 'https://i.pravatar.cc/150?img=0',
    
    // Preferências do usuário
    userPreferences: (state) => state.user?.preferences || {
      language: 'pt-BR',
      theme: 'light',
      notifications: true
    },
    
    // Verifica se pode tentar login (máximo 5 tentativas)
    canAttemptLogin: (state): boolean => state.loginAttempts < 5,
    
    // Token válido (simulação)
    hasValidToken: (state): boolean => {
      if (!state.token) return false
      
      try {
        // Simula validação de JWT
        const payload = JSON.parse(atob(state.token.split('.')[1]))
        return payload.exp > Date.now() / 1000
      } catch {
        return false
      }
    }
  },

  // 🎬 ACTIONS - Business Logic  
  actions: {
    // 💾 Inicializar auth do localStorage
    initializeAuth() {
      if (import.meta.client) {
        try {
          const token = localStorage.getItem('auth-token')
          const userData = localStorage.getItem('auth-user')
          
          if (token && userData && this.isValidToken(token)) {
            this.token = token
            this.user = JSON.parse(userData)
            this.isAuthenticated = true
            this.lastLoginAt = new Date(localStorage.getItem('last-login') || Date.now())
          } else {
            this.logout()
          }
        } catch (error) {
          console.error('Error initializing auth:', error)
          this.logout()
        }
      }
    },

    // 🔐 Login fake
    async login(email: string, password: string): Promise<boolean> {
      if (!this.canAttemptLogin) {
        this.error = 'Muitas tentativas de login. Tente novamente mais tarde.'
        return false
      }

      this.isLoading = true
      this.error = null
      this.loginAttempts++

      try {
        // Simula delay da API
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock validation - aceita qualquer senha para emails cadastrados
        const user = MOCK_USERS.find(u => u.email === email)
        
        if (!user || password.length < 3) {
          this.error = 'Email ou senha inválidos'
          return false
        }

        // Gera token fake JWT
        const fakeToken = this.generateFakeJWT(user)
        
        // Salva no estado
        this.user = user
        this.token = fakeToken
        this.isAuthenticated = true
        this.lastLoginAt = new Date()
        this.loginAttempts = 0
        
        // Persiste no localStorage
        this.persistAuth()
        
        return true
        
      } catch (error: any) {
        this.error = `Erro no login: ${error.message}`
        return false
      } finally {
        this.isLoading = false
      }
    },

    // 📤 Logout
    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.lastLoginAt = null
      this.error = null
      
      if (import.meta.client) {
        localStorage.removeItem('auth-token')
        localStorage.removeItem('auth-user')
        localStorage.removeItem('last-login')
        
        // Limpar favoritos também no logout
        localStorage.removeItem('movie-favorites')
      }
      
      // Limpar favoritos da store
      const favoritesStore = useFavoritesStore()
      favoritesStore.clearAllFavorites()
    },

    // 🔄 Refresh token (simulação)
    async refreshToken(): Promise<boolean> {
      if (!this.user) return false

      try {
        this.isLoading = true
        
        // Simula refresh
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const newToken = this.generateFakeJWT(this.user)
        this.token = newToken
        
        this.persistAuth()
        return true
        
      } catch (error: any) {
        this.error = `Erro ao renovar sessão: ${error.message}`
        this.logout()
        return false
      } finally {
        this.isLoading = false
      }
    },

    // ⚙️ Atualizar preferências
    async updatePreferences(preferences: Partial<User['preferences']>) {
      if (!this.user) return

      try {
        this.user.preferences = { ...this.user.preferences, ...preferences }
        this.persistAuth()
        this.error = null
      } catch (error: any) {
        this.error = `Erro ao salvar preferências: ${error.message}`
      }
    },

    // 🛡️ Validar token
    isValidToken(token: string): boolean {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.exp > Date.now() / 1000
      } catch {
        return false
      }
    },

    // 🏭 Gerar JWT fake
    generateFakeJWT(user: User): string {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payload = btoa(JSON.stringify({
        sub: user.id,
        email: user.email,
        name: user.name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24h
      }))
      const signature = btoa('fake-signature')
      
      return `${header}.${payload}.${signature}`
    },

    // 💾 Persistir autenticação
    persistAuth() {
      if (import.meta.client && this.user && this.token) {
        localStorage.setItem('auth-token', this.token)
        localStorage.setItem('auth-user', JSON.stringify(this.user))
        localStorage.setItem('last-login', this.lastLoginAt?.toISOString() || '')
      }
    },

    // 🗑️ Limpar erros
    clearError() {
      this.error = null
    },

    // 🔄 Reset tentativas de login
    resetLoginAttempts() {
      this.loginAttempts = 0
    }
  }
})