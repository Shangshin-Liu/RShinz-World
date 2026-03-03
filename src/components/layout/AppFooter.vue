<script setup lang="ts">
import { onMounted } from 'vue'
import { useVisitorCount } from '@/composables/useVisitorCount'

const currentYear = new Date().getFullYear()
const { count, loading, fetchCount } = useVisitorCount()

onMounted(() => {
  fetchCount()
})
</script>

<template>
  <footer class="app-footer">
    <div class="container footer-inner">
      <span class="logo">
        <span class="logo-bracket">&lt;</span>阿星<span class="logo-bracket">/&gt;</span>
      </span>
      <p class="copy">© {{ currentYear }} RShinz. All rights reserved.</p>
      <p class="built-with">Built with Vue 3 + Vite. Designed by Vibe Coding.</p>
      <p class="visitor-count">
        <span class="visitor-icon">👁</span>
        <span v-if="loading">載入中…</span>
        <span v-else-if="count !== null">累計訪客 <strong class="count-num">{{ count.toLocaleString() }}</strong> 人</span>
        <span v-else class="count-na">—</span>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  border-top: 1px solid var(--border);
  background: var(--bg-surface);
  padding: 2rem 0;
}

.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.logo {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.logo-bracket {
  color: var(--accent);
}

.copy,
.built-with {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.visitor-count {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.visitor-icon {
  font-size: 0.85rem;
  opacity: 0.7;
}

.count-num {
  color: var(--accent);
  font-weight: 700;
}

.count-na {
  opacity: 0.4;
}
</style>
