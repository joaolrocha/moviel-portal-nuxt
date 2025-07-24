<script setup lang="ts">
// Props interface
interface Props {
  isFavorite?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'filled' | 'outline' | 'minimal'
  disabled?: boolean
  loading?: boolean
  showText?: boolean
  favoriteText?: string
  unfavoriteText?: string
}

const props = withDefaults(defineProps<Props>(), {
  isFavorite: false,
  size: 'md',
  variant: 'filled',
  disabled: false,
  loading: false,
  showText: true,
  favoriteText: 'Favoritar',
  unfavoriteText: 'Remover'
})

// Emits
const emit = defineEmits<{
  toggle: [isFavorite: boolean]
  favorite: []
  unfavorite: []
}>()

// Local state for animation
const isAnimating = ref(false)

// Computed classes
const buttonClasses = computed(() => [
  'btn',
  'favorite-btn',
  `btn-${props.size}`,
  {
    // Variant styles
    'btn-danger': props.variant === 'filled' && props.isFavorite,
    'btn-outline-danger': props.variant === 'outline' || (props.variant === 'filled' && !props.isFavorite),
    'btn-link text-danger': props.variant === 'minimal' && props.isFavorite,
    'btn-link text-muted': props.variant === 'minimal' && !props.isFavorite,
    
    // States
    'disabled': props.disabled || props.loading,
    'is-animating': isAnimating.value,
    'w-100': props.showText, // Full width when showing text
    'd-flex align-items-center justify-content-center': true
  }
])

const iconClasses = computed(() => [
  'bi',
  props.isFavorite ? 'bi-heart-fill' : 'bi-heart',
  {
    'me-2': props.showText,
    'favorite-icon': true,
    'favorite-icon-active': props.isFavorite
  }
])

const buttonText = computed(() => {
  if (props.loading) return 'Aguarde...'
  return props.isFavorite ? props.unfavoriteText : props.favoriteText
})

// Actions
const handleClick = async () => {
  if (props.disabled || props.loading) return

  // Animation effect
  isAnimating.value = true
  setTimeout(() => {
    isAnimating.value = false
  }, 300)

  // Emit events
  emit('toggle', !props.isFavorite)
  
  if (props.isFavorite) {
    emit('unfavorite')
  } else {
    emit('favorite')
  }
}
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :aria-label="isFavorite ? `Remover dos favoritos` : `Adicionar aos favoritos`"
    :aria-pressed="isFavorite"
    @click="handleClick"
    type="button"
  >
    <!-- Loading spinner -->
    <span 
      v-if="loading" 
      class="spinner-border spinner-border-sm me-2" 
      role="status"
      aria-hidden="true"
    ></span>
    
    <!-- Heart icon -->
    <i 
      v-else
      :class="iconClasses"
      :aria-hidden="true"
    ></i>
    
    <!-- Text -->
    <span v-if="showText" class="favorite-text">
      {{ buttonText }}
    </span>
  </button>
</template>

<style scoped>
/* Base button styling */
.favorite-btn {
  transition: all 0.2s ease-in-out;
  border-radius: 0.375rem;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

/* Size variants */
.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-md {
  padding: 0.375rem 0.75rem;
  font-size: 0.9rem;
}

.btn-lg {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

/* Heart icon animations */
.favorite-icon {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform-origin: center;
}

.favorite-icon-active {
  animation: heartBeat 0.6s ease-in-out;
  color: #dc3545 !important;
}

/* Animation when toggling */
.is-animating .favorite-icon {
  transform: scale(1.3);
}

/* Heart beat animation */
@keyframes heartBeat {
  0% { transform: scale(1); }
  20% { transform: scale(1.25); }
  40% { transform: scale(1.1); }
  60% { transform: scale(1.25); }
  80% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Hover effects */
.favorite-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.favorite-btn:hover:not(:disabled) .favorite-icon {
  transform: scale(1.1);
}

/* Active/pressed state */
.favorite-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Disabled state */
.favorite-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Minimal variant specific styles */
.btn-link.favorite-btn {
  border: none;
  padding: 0.25rem 0.5rem;
  text-decoration: none;
}

.btn-link.favorite-btn:hover {
  text-decoration: none;
  background-color: rgba(220, 53, 69, 0.1);
}

/* Mobile optimizations */
@media (max-width: 576px) {
  .favorite-btn {
    min-height: 44px; /* Touch target size */
    font-size: 0.875rem;
  }
  
  .btn-sm {
    min-height: 38px;
    padding: 0.375rem 0.75rem;
  }
  
  .btn-lg {
    min-height: 48px;
    padding: 0.625rem 1.25rem;
  }
  
  .favorite-icon {
    font-size: 1.1em;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .favorite-btn,
  .favorite-icon {
    transition: none;
  }
  
  .favorite-icon-active {
    animation: none;
  }
  
  .is-animating .favorite-icon {
    transform: none;
  }
  
  @keyframes heartBeat {
    0%, 100% { transform: none; }
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .favorite-btn {
    border-width: 2px;
  }
}

/* Focus styles for keyboard navigation */
.favorite-btn:focus-visible {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}
</style>