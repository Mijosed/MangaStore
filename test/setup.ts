import { vi } from 'vitest'

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

global.fetch = vi.fn()

global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  warn: vi.fn(),
} 