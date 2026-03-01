<script setup lang="ts">
const email = 'soup1597@gmail.com'
</script>

<template>
  <section id="contact" class="section contact-section">
    <div class="container contact-inner">
      <h2 class="section-title">聯絡我</h2>
      <p class="section-subtitle">有任何問題或合作機會，歡迎來信！</p>

      <a :href="`mailto:${email}`" class="contact-card glass">
        <div class="card-glow" />
        <div class="icon-wrap">✉️</div>
        <div class="text">
          <p class="contact-label">電子郵件</p>
          <p class="contact-value">{{ email }}</p>
        </div>
        <span class="arrow-icon">→</span>
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
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 1.75rem;
  border-radius: var(--radius-xl);
  color: var(--text-primary);
  text-decoration: none;
  overflow: hidden;
  transition: transform var(--transition), border-color var(--transition), box-shadow var(--transition);
}

.contact-card:hover {
  border-color: var(--border-glow);
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(96,165,250,0.12);
  color: var(--text-primary);
}

.card-glow {
  position: absolute;
  inset: 0;
  background: var(--grad-glow);
  opacity: 0;
  transition: opacity var(--transition);
}

.contact-card:hover .card-glow { opacity: 1; }

.icon-wrap {
  font-size: 1.75rem;
  position: relative;
}

.text {
  position: relative;
}

.contact-label {
  font-size: 0.72rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.25rem;
}

.contact-value {
  font-size: 0.95rem;
  font-weight: 600;
  background: var(--grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.arrow-icon {
  margin-left: auto;
  font-size: 1.2rem;
  color: var(--text-muted);
  position: relative;
  transition: transform var(--transition), color var(--transition);
}

.contact-card:hover .arrow-icon {
  transform: translateX(4px);
  color: var(--accent);
}
</style>
