<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const props = defineProps<{ content: string; basePath?: string }>()

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)

// 將 content.md 中相對路徑的圖片換成 Vite 可存取的路徑
const processedContent = computed(() => {
  if (!props.basePath || !props.content) return props.content
  return props.content.replace(
    /!\[([^\]]*)\]\(assets\/([^)]+)\)/g,
    (_, alt, file) => `![${alt}](${import.meta.env.BASE_URL}posts/${props.basePath}/assets/${file})`,
  )
})

const html = computed(() => marked.parse(processedContent.value || '') as string)
</script>

<template>
  <article class="markdown-body" v-html="html" />
</template>

<style scoped>
.markdown-body {
  color: var(--text-primary);
  line-height: 1.8;
  font-size: 1rem;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  font-weight: 700;
  color: var(--text-primary);
  margin: 2rem 0 0.75rem;
  line-height: 1.3;
}

.markdown-body :deep(h1) { font-size: 2rem; }
.markdown-body :deep(h2) {
  font-size: 1.5rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
}
.markdown-body :deep(h3) { font-size: 1.25rem; }
.markdown-body :deep(h4) { font-size: 1.1rem; }
.markdown-body :deep(h5),
.markdown-body :deep(h6) { font-size: 1rem; }

.markdown-body :deep(p) {
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.markdown-body :deep(a) {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.markdown-body :deep(li) {
  margin-bottom: 0.25rem;
}

.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--accent-dim);
  padding: 0.5rem 1rem;
  margin: 1.5rem 0;
  background: var(--bg-surface);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  color: var(--text-secondary);
  font-style: italic;
}

.markdown-body :deep(pre) {
  margin: 1.5rem 0;
  border-radius: var(--radius-md);
  overflow-x: auto;
  border: 1px solid var(--border);
}

.markdown-body :deep(code:not(pre code)) {
  background: var(--bg-elevated);
  padding: 0.15em 0.4em;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.875em;
  color: var(--accent-secondary);
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: var(--radius-md);
  margin: 1.5rem auto;
  border: 1px solid var(--border);
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2rem 0;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 0.9rem;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  padding: 0.6rem 1rem;
  border: 1px solid var(--border);
  text-align: left;
}

.markdown-body :deep(th) {
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-weight: 600;
}
</style>
