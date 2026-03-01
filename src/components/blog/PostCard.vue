<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface Props {
  title: string
  category: string
  tags: string[]
  date: string
  slug: string
}

defineProps<Props>()

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <RouterLink :to="`/blog/${slug}`" class="post-card glass">
    <div class="card-glow" />
    <div class="card-meta">
      <span class="category-badge">{{ category }}</span>
      <span class="date">{{ formatDate(date) }}</span>
    </div>
    <h3 class="card-title">{{ title }}</h3>
    <div class="card-tags">
      <span v-for="tag in tags" :key="tag" class="tag"># {{ tag }}</span>
    </div>
    <span class="read-more">閱讀文章 <span class="arrow">→</span></span>
  </RouterLink>
</template>

<style scoped>
.post-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  border-radius: var(--radius-xl);
  color: var(--text-primary);
  text-decoration: none;
  overflow: hidden;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
}

.post-card:hover {
  transform: translateY(-5px);
  border-color: var(--border-glow);
  box-shadow: 0 12px 40px rgba(96, 165, 250, 0.12), 0 0 0 1px rgba(96,165,250,0.1);
  color: var(--text-primary);
}

/* Hover glow overlay */
.card-glow {
  position: absolute;
  inset: 0;
  background: var(--grad-glow);
  opacity: 0;
  transition: opacity var(--transition);
  pointer-events: none;
  border-radius: inherit;
}

.post-card:hover .card-glow {
  opacity: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.category-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-glow);
  background: var(--accent-glow);
  white-space: nowrap;
}

.date {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.card-title {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--text-primary);
  transition: color var(--transition);
  position: relative;
}

.post-card:hover .card-title {
  background: var(--grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  position: relative;
}

.tag {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.read-more {
  font-size: 0.82rem;
  color: var(--accent);
  margin-top: auto;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.arrow {
  display: inline-block;
  transition: transform var(--transition);
}

.post-card:hover .arrow {
  transform: translateX(4px);
}
</style>
