<script setup lang="ts">
import { NIcon } from 'naive-ui'
withDefaults(defineProps<{ name: string; size?: number }>(), { size: 20 })
const paths: Record<string, string> = {
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  external: 'M7 17 17 7M7 7h10v10',
  code: 'm8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16',
  book: 'M4 4h6l2 2 2-2h6v15h-6l-2 2-2-2H4zM12 6v15',
  spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z',
  layers: 'm12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5',
  clock: 'M12 8v4l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  leaf: 'M19 4C9 3 3 8 6 15s13 3 13-11ZM5 20l9-10',
  folder: 'M3 6h6l2 2h10v12H3z',
  terminal: 'm5 7 5 5-5 5m8 0h6'
}
</script>

<template><NIcon :size="size" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path :d="paths[name] || paths.book" /></svg></NIcon></template>
