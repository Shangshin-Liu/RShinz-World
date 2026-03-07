<script setup lang="ts">
import { ref } from 'vue'
import { usePosts, taxonomyCategories, taxonomyTags } from '@/composables/usePosts'
import PostCard from '@/components/blog/PostCard.vue'
import { Code, BookOpen, Layers, Terminal, Coffee, Briefcase, Bug, Folder, Tag, Filter, X } from 'lucide-vue-next'

const { posts, searchQuery, activeTag, activeCategory, clearFilters } =
  usePosts()

const searchInput = ref('')
const isFilterOpen = ref(false)

const categoryIcons = {
  'tech': Code,
  'tutorial': BookOpen,
  'architecture': Layers,
  'devops': Terminal,
  'life': Coffee,
  'career': Briefcase,
  'test': Bug
} as Record<string, any>

function getCategoryIcon(label: string) {
  return categoryIcons[label] || Folder
}

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
        <input v-model="searchInput" type="text" placeholder="搜尋文章標題或標籤…" class="search-input" @input="onSearch" />
        <button class="btn filter-toggle" :class="{ 'active': isFilterOpen || activeCategory || activeTag }"
          @click="isFilterOpen = !isFilterOpen">
          <Filter :size="16" />
          <span>篩選</span>
          <span v-if="activeCategory || activeTag" class="filter-dot"></span>
        </button>
        <button v-if="searchInput || activeTag || activeCategory" class="btn btn-ghost clear-btn" @click="onClear">
          <X :size="16" />
          <span>清除</span>
        </button>
      </div>

      <div class="filter-wrapper" :class="{ 'is-open': isFilterOpen }">
        <div class="filter-inner">
          <div class="filter-row">
            <div class="filter-group">
              <span class="filter-label">分類：</span>
              <button v-for="cat in taxonomyCategories" :key="cat.id" class="badge"
                :class="{ active: activeCategory === cat.label }" @click="setCategory(cat.label)">
                <component :is="getCategoryIcon(cat.id)" :size="14" />
                {{ cat.label }}
              </button>
            </div>
            <div class="filter-group">
              <span class="filter-label">標籤：</span>
              <button v-for="tag in taxonomyTags" :key="tag.id" class="badge"
                :class="{ active: activeTag === tag.label }" @click="setTag(tag.label)">
                <Tag :size="14" />
                {{ tag.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Posts -->
      <div v-if="posts.length" class="posts-grid">
        <PostCard v-for="post in posts" :key="post.slug" :slug="post.slug" :categoryId="post.attributes.categoryId"
          :title="post.attributes.title" :category="post.attributes.category" :tags="post.attributes.tags"
          :date="post.attributes.date" />
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

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.65rem 1rem;
  color: var(--text-secondary);
  position: relative;
  transition: all var(--transition);
  cursor: pointer;
}

.filter-toggle:hover,
.filter-toggle.active {
  color: var(--text-primary);
  border-color: var(--accent);
}

.filter-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--accent);
  box-shadow: 0 0 0 2px var(--bg-default);
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
}

.filter-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 1.5rem;
}

.filter-wrapper.is-open {
  grid-template-rows: 1fr;
  margin-bottom: 2.5rem;
}

.filter-inner {
  overflow: hidden;
}

.filter-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 0.5rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
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
