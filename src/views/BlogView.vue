<script setup lang="ts">
import { ref } from 'vue'
import { usePosts } from '@/composables/usePosts'
import PostCard from '@/components/blog/PostCard.vue'

const { posts, allTags, allCategories, searchQuery, activeTag, activeCategory, clearFilters } =
  usePosts()

const searchInput = ref('')

function onSearch() {
  searchQuery.value = searchInput.value
}

function setTag(tag: string) {
  activeTag.value = activeTag.value === tag ? '' : tag
}

function setCategory(cat: string) {
  activeCategory.value = activeCategory.value === cat ? '' : cat
}

function onClear() {
  searchInput.value = ''
  clearFilters()
}
</script>

<template>
  <main class="blog-page">
    <div class="blog-hero">
      <div class="container">
        <h1 class="blog-title">文章列表</h1>
        <p class="blog-desc">記錄技術思考與開發心得</p>
      </div>
    </div>

    <div class="container blog-body">
      <!-- Search & Filter -->
      <div class="search-bar">
        <input
          v-model="searchInput"
          type="text"
          placeholder="搜尋文章標題或標籤…"
          class="search-input"
          @input="onSearch"
        />
        <button v-if="searchInput || activeTag || activeCategory" class="btn btn-ghost clear-btn" @click="onClear">
          清除
        </button>
      </div>

      <div class="filter-row">
        <div class="filter-group">
          <span class="filter-label">分類：</span>
          <button
            v-for="cat in allCategories"
            :key="cat"
            class="badge"
            :class="{ active: activeCategory === cat }"
            @click="setCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>
        <div class="filter-group">
          <span class="filter-label">標籤：</span>
          <button
            v-for="tag in allTags"
            :key="tag"
            class="badge"
            :class="{ active: activeTag === tag }"
            @click="setTag(tag)"
          >
            # {{ tag }}
          </button>
        </div>
      </div>

      <!-- Posts -->
      <div v-if="posts.length" class="posts-grid">
        <PostCard
          v-for="post in posts"
          :key="post.slug"
          :slug="post.slug"
          :title="post.attributes.title"
          :category="post.attributes.category"
          :tags="post.attributes.tags"
          :date="post.attributes.date"
        />
      </div>

      <div v-else class="empty-state">
        <p>😞 找不到符合條件的文章</p>
        <button class="btn btn-ghost" @click="onClear">清除篩選</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.blog-page {
  min-height: 100svh;
  padding-top: 64px;
}

.blog-hero {
  padding: 4rem 0 2.5rem;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(88, 166, 255, 0.06) 0%, transparent 70%),
    var(--bg-surface);
  border-bottom: 1px solid var(--border);
}

.blog-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  background: linear-gradient(135deg, var(--text-primary) 40%, var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.blog-desc {
  color: var(--text-secondary);
  font-size: 1rem;
}

.blog-body {
  padding-top: 2.5rem;
  padding-bottom: 4rem;
}

.search-bar {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.65rem 1rem;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.9rem;
  outline: none;
  transition: border-color var(--transition);
}

.search-input:focus {
  border-color: var(--accent-dim);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.filter-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  min-width: 36px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}
</style>
