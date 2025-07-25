
// tests/setup.ts
import { vi } from 'vitest'

// Mock básico do fetch
global.fetch = vi.fn()

// Mock do localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true
})

