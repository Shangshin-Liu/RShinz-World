<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePosts } from '@/composables/usePosts'
import MarkdownRenderer from '@/components/blog/MarkdownRenderer.vue'

const route = useRoute()
const router = useRouter()
const { getPost } = usePosts()

const slug = computed(() => route.params.slug as string)
const post = computed(() => getPost(slug.value))

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function goBack() {
  router.push('/blog')
}
</script>

<template>
  <main class="post-page">
    <div v-if="post" class="container post-layout">
      <!-- Back -->
      <button class="back-btn" @click="goBack">← 返回文章列表</button>

      <!-- Header -->
      <header class="post-header">
        <div class="post-meta">
          <span class="category-badge">{{ post.attributes.category }}</span>
          <span class="date">{{ formatDate(post.attributes.date) }}</span>
        </div>
        <h1 class="post-title">{{ post.attributes.title }}</h1>
        <div class="post-tags">
          <span v-for="tag in post.attributes.tags" :key="tag" class="tag"># {{ tag }}</span>
        </div>
      </header>

      <div class="post-divider" />

      <!-- Content -->
      <MarkdownRenderer :content="post.content" :base-path="slug" />
    </div>

    <div v-else class="container not-found">
      <p>找不到文章 😢</p>
      <button class="btn btn-primary" @click="goBack">返回列表</button>
    </div>
  </main>
</template>

<style scoped>
.post-page {
  min-height: 100svh;
  padding-top: 64px;
}

.post-layout {
  max-width: 760px;
  padding-top: 3rem;
  padding-bottom: 6rem;
}

.back-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 2.5rem;
  transition: color var(--transition);
}

.back-btn:hover {
  color: var(--accent);
}

.post-header {
  margin-bottom: 2rem;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
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
  font-size: 0.82rem;
  color: var(--text-muted);
}

.post-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  line-height: 1.25;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.post-divider {
  height: 1px;
  background: var(--border);
  margin-bottom: 2.5rem;
}

.not-found {
  padding-top: 8rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  color: var(--text-secondary);
}
</style>
