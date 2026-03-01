<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="container footer-inner">
      <span class="logo">
        <span class="logo-bracket">&lt;</span>阿星<span class="logo-bracket">/&gt;</span>
      </span>
      <p class="copy">© {{ currentYear }} RShinz. All rights reserved.</p>
      <p class="built-with">Built with Vue 3 + Vite. Designed by Vibe Coding.</p>
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
</style>
