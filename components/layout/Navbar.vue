<script setup lang="ts">
import { useAuthStore } from '~/store/auth'
import { useFavoritesStore } from '~/store/favorites'

// Stores
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()

// Route and router
const route = useRoute()
const router = useRouter()

// Reactive state
const isMenuOpen = ref(false)

// Computed properties
const isAuthenticated = computed(() => authStore.isLoggedIn)
const currentUser = computed(() => authStore.currentUser)
const favoritesCount = computed(() => favoritesStore.favoritesCount)

// Actions
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleLogin = () => {
  router.push('/login')
  closeMenu()
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
  closeMenu()
}

const navigateTo = (path: string) => {
  router.push(path)
  closeMenu()
}

// Close menu on route change
watch(route, () => {
  closeMenu()
})
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
    <div class="container-fluid">
      <!-- Brand -->
      <NuxtLink to="/" class="navbar-brand d-flex align-items-center" @click="closeMenu">
        <div class="me-2 p-2 bg-primary rounded text-white">
          <i class="bi bi-film"></i>
        </div>
        <span class="fw-bold">Movie Portal</span>
      </NuxtLink>

      <!-- Mobile toggle -->
      <button 
        class="navbar-toggler"
        type="button"
        @click="toggleMenu"
        :aria-expanded="isMenuOpen"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation -->
      <div class="collapse navbar-collapse" :class="{ 'show': isMenuOpen }">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <NuxtLink 
              to="/" 
              class="nav-link"
              :class="{ 'active': route.path === '/' }"
              @click="navigateTo('/')"
            >
              <i class="bi bi-house me-1"></i>
              Início
            </NuxtLink>
          </li>
          
          <li class="nav-item">
            <NuxtLink 
              to="/favoritos" 
              class="nav-link d-flex align-items-center"
              :class="{ 'active': route.path === '/favoritos' }"
              @click="navigateTo('/favoritos')"
            >
              <i class="bi bi-heart me-1"></i>
              Favoritos
              <span 
                v-if="favoritesCount > 0" 
                class="badge bg-danger ms-2"
              >
                {{ favoritesCount }}
              </span>
            </NuxtLink>
          </li>
        </ul>

        <!-- User section -->
        <div class="d-flex align-items-center">
          <!-- Authenticated user -->
          <div v-if="isAuthenticated" class="d-flex align-items-center gap-3">
            <div class="d-flex align-items-center">
              <img 
                :src="currentUser?.avatar || 'https://i.pravatar.cc/32?img=0'"
                :alt="currentUser?.name || 'User'"
                class="rounded-circle me-2"
                width="32"
                height="32"
              >
              <span class="d-none d-lg-inline text-muted">{{ currentUser?.name }}</span>
            </div>
            <button @click="handleLogout" class="btn btn-outline-danger btn-sm">
              <i class="bi bi-box-arrow-right"></i>
              <span class="d-none d-lg-inline ms-1">Sair</span>
            </button>
          </div>

          <!-- Guest user -->
          <div v-else>
            <button @click="handleLogin" class="btn btn-primary btn-sm">
              <i class="bi bi-person"></i>
              <span class="d-none d-lg-inline ms-1">Entrar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Minimal custom styles */
.navbar-brand {
  font-size: 1.5rem;
}

.nav-link.active {
  font-weight: 600;
  color: var(--bs-primary) !important;
}

.badge {
  font-size: 0.7rem;
}

/* Mobile menu fix */
@media (max-width: 991.98px) {
  .navbar-collapse {
    margin-top: 1rem;
  }
  
  .d-flex.align-items-center.gap-3 {
    flex-direction: column;
    align-items: start !important;
    gap: 0.5rem !important;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #dee2e6;
  }
}
</style>