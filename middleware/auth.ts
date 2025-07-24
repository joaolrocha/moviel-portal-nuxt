import { useAuthStore } from "~/store/auth"

export default defineNuxtRouteMiddleware((to, from) => {
  // Get auth store
  const authStore = useAuthStore()

  // Initialize auth on first load
  if (import.meta.client && !authStore.isAuthenticated) {
    authStore.initializeAuth()
  }

  // Check if user is authenticated
  if (!authStore.isLoggedIn) {
    // Store the intended destination
    const redirectTo = to.fullPath

    // Show notification (optional)
    console.log('Acesso negado. Redirecionando para login...')

    // Redirect to login with return URL
    return navigateTo({
      path: '/login',
      query: { 
        redirect: redirectTo,
        message: 'Você precisa estar logado para acessar esta página.'
      }
    })
  }

  // User is authenticated, allow access
  return true
})