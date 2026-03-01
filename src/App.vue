<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<template>
  <AppHeader />
  <RouterView />
  <AppFooter />
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
}
</style>
