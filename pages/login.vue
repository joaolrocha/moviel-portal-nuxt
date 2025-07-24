<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

// Store
const authStore = useAuthStore()

// Route and router
const route = useRoute()
const router = useRouter()

// Form data
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

// Get redirect URL and message from query
const redirectTo = computed(() => route.query.redirect as string || '/')
const message = computed(() => route.query.message as string || '')

// SEO
useHead({
  title: 'Login - Movie Portal',
  meta: [
    { name: 'description', content: 'Faça login no Movie Portal para acessar seus favoritos' }
  ]
})

// Handle login
const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Preencha email e senha'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const success = await authStore.login(email.value, password.value)
    
    if (success) {
      // Redirect to intended page or home
      await router.push(redirectTo.value)
    } else {
      error.value = authStore.error || 'Erro no login'
    }
  } catch (err: any) {
    error.value = err.message || 'Erro inesperado'
  } finally {
    isLoading.value = false
  }
}

// Initialize auth store
onMounted(() => {
  authStore.initializeAuth()
  
  // If already logged in, redirect
  if (authStore.isLoggedIn) {
    router.push(redirectTo.value)
  }
})
</script>

<template>
  <div class="container-fluid vh-100">
    <div class="row h-100">
      <!-- Left side - Login Form -->
      <div class="col-lg-6 d-flex align-items-center justify-content-center">
        <div class="w-100" style="max-width: 400px;">
          <div class="text-center mb-4">
            <div class="mb-3">
              <div class="d-inline-flex p-3 bg-primary rounded-3 text-white">
                <i class="bi bi-film fs-2"></i>
              </div>
            </div>
            <h1 class="h3 fw-bold">Movie Portal</h1>
            <p class="text-muted">Faça login para acessar seus favoritos</p>
          </div>

          <!-- Alert message -->
          <div v-if="message" class="alert alert-info" role="alert">
            <i class="bi bi-info-circle me-2"></i>
            {{ message }}
          </div>

          <!-- Error message -->
          <div v-if="error" class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ error }}
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                class="form-control"
                placeholder="Digite seu email"
                :disabled="isLoading"
                required
              >
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Senha</label>
              <input
                id="password"
                v-model="password"
                type="password"
                class="form-control"
                placeholder="Digite sua senha"
                :disabled="isLoading"
                required
              >
            </div>

            <button 
              type="submit" 
              class="btn btn-primary w-100 py-2"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isLoading ? 'Entrando...' : 'Entrar' }}
            </button>
          </form>

          <!-- Demo credentials -->
          <div class="mt-4 p-3 bg-light rounded">
            <h6 class="fw-bold mb-2">Credenciais de teste:</h6>
            <small class="text-muted">
              <strong>Email:</strong> joao@email.com<br>
              <strong>Senha:</strong> qualquer coisa (mín. 3 caracteres)
            </small>
            <hr class="my-2">
            <small class="text-muted">
              <strong>Email:</strong> maria@email.com<br>
              <strong>Senha:</strong> qualquer coisa (mín. 3 caracteres)
            </small>
          </div>

          <!-- Back to home -->
          <div class="text-center mt-3">
            <NuxtLink to="/" class="text-decoration-none">
              <i class="bi bi-arrow-left me-1"></i>
              Voltar ao início
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Right side - Image/Hero -->
      <div class="col-lg-6 d-none d-lg-block position-relative">
        <div 
          class="h-100 d-flex align-items-center justify-content-center text-white"
          style="
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            background-size: cover;
            background-position: center;
          "
        >
          <div class="text-center p-5">
            <i class="bi bi-heart-fill display-1 mb-4"></i>
            <h2 class="fw-bold mb-3">Seus Filmes Favoritos</h2>
            <p class="lead opacity-90">
              Salve seus filmes preferidos e tenha acesso a eles a qualquer momento.
            </p>
            <div class="row mt-4">
              <div class="col-4 text-center">
                <i class="bi bi-star-fill fs-1 mb-2"></i>
                <p class="small">Avalie filmes</p>
              </div>
              <div class="col-4 text-center">
                <i class="bi bi-heart-fill fs-1 mb-2"></i>
                <p class="small">Salve favoritos</p>
              </div>
              <div class="col-4 text-center">
                <i class="bi bi-share-fill fs-1 mb-2"></i>
                <p class="small">Compartilhe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vh-100 {
  min-height: 100vh;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.btn-primary {
  border-radius: 8px;
}
</style>