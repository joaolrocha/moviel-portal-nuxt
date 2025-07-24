<script setup lang="ts">
import type { Credits, CastMember, CrewMember } from '~/composables/useTmdb'

// Props interface
interface Props {
  credits?: Credits | null
  maxCastMembers?: number
  showDirector?: boolean
  showCast?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  credits: null,
  maxCastMembers: 8,
  showDirector: true,
  showCast: true
})

// Composables
const { getImageUrl } = useTmdb()

// Computed properties
const mainCast = computed((): CastMember[] => 
  props.credits?.cast.slice(0, props.maxCastMembers) || []
)

const director = computed((): CrewMember | undefined => 
  props.credits?.crew.find(person => person.job === 'Director')
)

const hasContent = computed((): boolean => 
  (props.showDirector && !!director.value) || 
  (props.showCast && mainCast.value.length > 0)
)
</script>

<template>
  <div v-if="hasContent" class="cast-crew-section">
    <!-- Director -->
    <div v-if="showDirector && director" class="director-section mb-4">
      <h3 class="section-title">Direção</h3>
      <div class="director-card">
        <h4 class="director-name">{{ director.name }}</h4>
      </div>
    </div>

    <!-- Cast -->
    <div v-if="showCast && mainCast.length" class="cast-section">
      <h3 class="section-title">Elenco Principal</h3>
      <div class="row">
        <div 
          v-for="actor in mainCast" 
          :key="actor.id"
          class="col-lg-3 col-md-4 col-sm-6 mb-4"
        >
          <div class="cast-card text-center">
            <div class="cast-photo-container mb-2">
              <img 
                v-if="actor.profile_path"
                :src="getImageUrl(actor.profile_path, 'w185')"
                :alt="`Foto de ${actor.name}`"
                class="cast-photo rounded-circle"
                loading="lazy"
              >
              <div v-else class="cast-photo-placeholder rounded-circle">
                <i class="bi bi-person" aria-hidden="true"></i>
              </div>
            </div>
            <h5 class="cast-name">{{ actor.name }}</h5>
            <p class="cast-character text-muted">{{ actor.character }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Slot for additional crew sections -->
    <slot name="additional-crew" :crew="credits?.crew" />
  </div>
</template>

<style>
</style>