<script lang="ts" setup>
import { Toaster as Sonner, type ToasterProps } from 'vue-sonner'

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    class="toaster group"
    v-bind="props"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--success-bg': 'hsl(var(--success))',
      '--success-text': 'hsl(var(--success-foreground))',
      '--error-bg': 'hsl(var(--destructive))',
      '--error-text': 'hsl(var(--destructive-foreground))',
      '--info-bg': 'hsl(var(--primary))',
      '--info-text': 'hsl(var(--primary-foreground))',
      '--warning-bg': 'hsl(var(--warning))',
      '--warning-text': 'hsl(var(--warning-foreground))'
    }"
  />
</template>

<style>
.toaster {
  --vh: 100vh;
  --normal-bg: #fff;
  --normal-border: #e5e5e5;
  --normal-text: #111;
  --success-bg: #4caf50;
  --success-text: #fff;
  --error-bg: #f44336;
  --error-text: #fff;
  --info-bg: #2196f3;
  --info-text: #fff;
  --warning-bg: #ff9800;
  --warning-text: #fff;

  position: fixed;
  width: var(--width, 360px);
  font-family: ui-sans-serif, system-ui, -apple-system;
  z-index: 100;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toaster[data-sonner-position^='top-'] {
  top: env(safe-area-inset-top, 16px);
}

.toaster[data-sonner-position$='-right'] {
  right: 16px;
}

.toaster[data-sonner-position$='-left'] {
  left: 16px;
}

.toaster[data-sonner-position$='-center'] {
  left: 50%;
  transform: translateX(-50%);
}

.toaster[data-sonner-position^='bottom-'] {
  bottom: env(safe-area-inset-bottom, 16px);
  flex-direction: column-reverse;
}

.dark .toaster {
  --normal-bg: hsl(var(--background));
  --normal-border: hsl(var(--border));
  --normal-text: hsl(var(--foreground));
}
</style>
