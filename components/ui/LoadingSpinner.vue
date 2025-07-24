<script setup lang="ts">
// Props com valores padrão responsivos
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'light' | 'dark'
  text?: string
  centered?: boolean
  fullHeight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'primary',
  text: 'Carregando...',
  centered: true,
  fullHeight: false
})

// Classes dinâmicas baseadas nas props
const spinnerClasses = computed(() => [
  'spinner-border',
  `text-${props.variant}`,
  {
    'spinner-border-sm': props.size === 'sm',
    // md é o padrão do Bootstrap
    'spinner-border-lg': props.size === 'lg',
    'spinner-border-xl': props.size === 'xl'
  }
])

const containerClasses = computed(() => [
  {
    'text-center': props.centered,
    'd-flex flex-column justify-content-center align-items-center': props.centered,
    'min-vh-100': props.fullHeight,
    'py-4': !props.fullHeight,
    'py-5': props.fullHeight
  }
])
</script>

<template>
  <div :class="containerClasses">
    <!-- Spinner -->
    <div 
      :class="spinnerClasses"
      role="status"
      :aria-label="text"
    >
      <span class="visually-hidden">{{ text }}</span>
    </div>
    
    <!-- Texto opcional (responsivo) -->
    <div 
      v-if="text" 
      class="mt-3 text-muted"
      :class="{
        'fs-6': size === 'sm',
        'fs-5': size === 'md', 
        'fs-4': size === 'lg',
        'fs-3': size === 'xl'
      }"
    >
      {{ text }}
    </div>
  </div>
</template>

<style scoped>
/* Spinner customizado para tamanhos extras */
.spinner-border-lg {
  width: 3rem;
  height: 3rem;
  border-width: 0.3em;
}

.spinner-border-xl {
  width: 4rem;
  height: 4rem;
  border-width: 0.4em;
}

/* Responsividade mobile first */
@media (max-width: 576px) {
  /* Em mobile, reduz um pouco os tamanhos */
  .spinner-border-lg {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .spinner-border-xl {
    width: 3.5rem;
    height: 3.5rem;
  }
}

/* Animação suave */
.spinner-border {
  animation-duration: 0.85s;
}

/* Estados de loading mais acessíveis */
@media (prefers-reduced-motion: reduce) {
  .spinner-border {
    animation-duration: 1.5s;
  }
}
</style>