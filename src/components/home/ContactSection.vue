<script setup lang="ts">
const email = 'soup1597@gmail.com'
</script>

<template>
  <section id="contact" class="section contact-section">
    <div class="container contact-inner">
      <h2 class="section-title">聯絡我</h2>
      <p class="section-subtitle">有任何問題或合作機會，歡迎來信！</p>

      <a :href="`mailto:${email}`" class="contact-card">
        <div class="icon-wrap">✉️</div>
        <div>
          <p class="contact-label">電子郵件</p>
          <p class="contact-value">{{ email }}</p>
        </div>
      </a>
    </div>
  </section>
</template>

<style scoped>
.contact-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 1.75rem;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  text-decoration: none;
  transition:
    border-color var(--transition),
    transform var(--transition),
    box-shadow var(--transition);
}

.contact-card:hover {
  border-color: var(--accent-dim);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  color: var(--text-primary);
}

.icon-wrap {
  font-size: 1.75rem;
}

.contact-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.2rem;
}

.contact-value {
  font-size: 1rem;
  color: var(--accent);
  font-weight: 500;
}
</style>
