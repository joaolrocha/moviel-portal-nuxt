<script setup lang="ts">
// Props interface
interface Props {
  title?: string
  message?: string | null
  variant?: 'danger' | 'warning' | 'info' | 'dark'
  dismissible?: boolean
  showIcon?: boolean
  retryAction?: () => void | Promise<void>
  retryText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Ops! Algo deu errado',
  message: null,
  variant: 'danger',
  dismissible: false,
  showIcon: true,
  // Não definir default para retryAction - deixar undefined
  retryText: 'Tentar novamente'
})

// Emits
const emit = defineEmits<{
  dismiss: []
  retry: []
}>()

// Local state
const isVisible = ref(true)
const isRetrying = ref(false)

// Computed properties
const alertClasses = computed(() => [
  'alert',
  `alert-${props.variant}`,
  {
    'alert-dismissible': props.dismissible
  }
])

const hasRetryAction = computed(() => typeof props.retryAction === 'function')

// Icon mapping
const iconMap = {
  danger: 'bi-exclamation-triangle-fill',
  warning: 'bi-exclamation-triangle',
  info: 'bi-info-circle-fill',
  dark: 'bi-exclamation-circle'
}

const iconClass = computed(() => iconMap[props.variant])

// Actions
const handleDismiss = () => {
  isVisible.value = false
  emit('dismiss')
}

const handleRetry = async () => {
  if (hasRetryAction.value && !isRetrying.value) {
    isRetrying.value = true
    emit('retry')
    
    try {
      await props.retryAction!()
    } catch (error) {
      console.error('Retry failed:', error)
    } finally {
      isRetrying.value = false
    }
  }
}
</script>

<template>
  <Transition
    name="alert-fade"
    enter-active-class="fade-enter-active"
    leave-active-class="fade-leave-active"
    enter-from-class="fade-enter-from"
    leave-to-class="fade-leave-to"
  >
    <div 
      v-if="isVisible" 
      :class="alertClasses"
      role="alert"
      :aria-live="variant === 'danger' ? 'assertive' : 'polite'"
    >
      <div class="d-flex align-items-start">
        <!-- Icon -->
        <div v-if="showIcon" class="flex-shrink-0 me-3">
          <i 
            :class="iconClass" 
            class="fs-4"
            :aria-hidden="true"
          ></i>
        </div>
        
        <!-- Content -->
        <div class="flex-grow-1">
          <!-- Title -->
          <h4 
            v-if="title" 
            class="alert-heading mb-2"
            :class="{
              'fs-6': $slots.default || message, // Smaller if has content
              'fs-5': !$slots.default && !message // Larger if no content
            }"
          >
            {{ title }}
          </h4>
          
          <!-- Message -->
          <div v-if="message" class="mb-0">
            <p class="mb-2 word-break-all">{{ message }}</p>
          </div>
          
          <!-- Slot content -->
          <div v-if="$slots.default" class="mb-2 word-break-all">
            <slot />
          </div>
          
          <!-- Actions -->
          <div 
            v-if="hasRetryAction" 
            class="mt-3 d-flex flex-column flex-sm-row gap-2"
          >
            <button
              @click="handleRetry"
              :disabled="isRetrying"
              class="btn btn-sm w-100 w-sm-auto"
              :class="{
                'btn-danger': variant === 'danger',
                'btn-warning': variant === 'warning', 
                'btn-info': variant === 'info',
                'btn-dark': variant === 'dark'
              }"
            >
              <span 
                v-if="isRetrying" 
                class="spinner-border spinner-border-sm me-2" 
                role="status"
                aria-hidden="true"
              ></span>
              {{ isRetrying ? 'Tentando...' : retryText }}
            </button>
          </div>
        </div>
        
        <!-- Dismiss button -->
        <button
          v-if="dismissible"
          @click="handleDismiss"
          type="button"
          class="btn-close"
          :class="{
            'btn-close-white': variant === 'dark'
          }"
          :aria-label="'Fechar alerta'"
        ></button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive adjustments - mobile first */
@media (max-width: 576px) {
  .alert {
    margin-bottom: 1rem;
    padding: 0.75rem;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  .alert-heading {
    font-size: 1rem !important;
  }
  
  /* Stack buttons on mobile and make full width */
  .d-flex.gap-2 {
    flex-direction: column !important;
  }
  
  .btn-sm {
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
    width: 100% !important;
  }
}

/* Word break for long URLs and text */
.word-break-all {
  word-break: break-all;
  overflow-wrap: break-word;
  hyphens: auto;
}

/* Improve icon spacing on small screens */
@media (max-width: 576px) {
  .me-3 {
    margin-right: 0.75rem !important;
  }
  
  .fs-4 {
    font-size: 1.25rem !important;
  }
  
  /* Better text wrapping on mobile */
  .alert p {
    font-size: 0.9rem;
    line-height: 1.4;
  }
}

/* Enhanced accessibility */
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}

/* Dark mode considerations */
@media (prefers-color-scheme: dark) {
  .alert-info {
    --bs-alert-color: #9ec5fe;
    --bs-alert-bg: #031633;
    --bs-alert-border: #084298;
  }
}
</style>