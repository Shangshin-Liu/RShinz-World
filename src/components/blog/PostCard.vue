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
  <RouterLink :to="`/blog/${slug}`" class="post-card">
    <div class="card-meta">
      <span class="category-badge">{{ category }}</span>
      <span class="date">{{ formatDate(date) }}</span>
    </div>
    <h3 class="card-title">{{ title }}</h3>
    <div class="card-tags">
      <span v-for="tag in tags" :key="tag" class="tag"># {{ tag }}</span>
    </div>
    <span class="read-more">閱讀文章 →</span>
  </RouterLink>
</template>

<style scoped>
.post-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  transition:
    border-color var(--transition),
    transform var(--transition),
    box-shadow var(--transition);
  text-decoration: none;
}

.post-card:hover {
  border-color: var(--accent-dim);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-badge {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
  background: var(--accent-glow);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--accent-dim);
}

.date {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-primary);
  transition: color var(--transition);
}

.post-card:hover .card-title {
  color: var(--accent-secondary);
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.read-more {
  font-size: 0.82rem;
  color: var(--accent);
  margin-top: auto;
}
</style>
