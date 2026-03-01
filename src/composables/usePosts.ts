import { ref, computed } from 'vue'
import yaml from 'js-yaml'
import type { Post, RawPostAttributes, Taxonomy, TaxonomyItem } from '@/types'

// ── 1. 載入 taxonomy ──────────────────────────────────────────
const taxonomyModules = import.meta.glob('/posts/taxonomy.yaml', {
    query: '?raw',
    import: 'default',
    eager: true,
}) as Record<string, string>

const _rawTaxonomy = yaml.load(
    Object.values(taxonomyModules)[0] ?? 'categories: {}\ntags: {}'
) as Taxonomy

/** 將 taxonomy 的 key 建成 { id, label }[] */
function buildItems(map: Record<string, { label: string }>): TaxonomyItem[] {
    return Object.entries(map).map(([id, { label }]) => ({ id, label }))
}

export const taxonomyCategories: TaxonomyItem[] = buildItems(_rawTaxonomy.categories ?? {})
export const taxonomyTags: TaxonomyItem[] = buildItems(_rawTaxonomy.tags ?? {})

/** 代號 → 顯示名稱（找不到時 fallback 為代號本身）*/
function resolveCategory(id: string): string {
    return _rawTaxonomy.categories?.[id]?.label ?? id
}
function resolveTag(id: string): string {
    return _rawTaxonomy.tags?.[id]?.label ?? id
}

// ── 2. 載入文章 ───────────────────────────────────────────────
const attrModules = import.meta.glob('/posts/**/attributes.yaml', {
    query: '?raw',
    import: 'default',
    eager: true,
}) as Record<string, string>

const contentModules = import.meta.glob('/posts/**/content.md', {
    query: '?raw',
    import: 'default',
    eager: true,
}) as Record<string, string>

function parseSlug(path: string): string {
    const match = path.match(/\/posts\/(.+)\/attributes\.yaml$/)
    return match ? match[1] : path
}

function buildPosts(): Post[] {
    return Object.entries(attrModules)
        .map(([attrPath, attrRaw]) => {
            const slug = parseSlug(attrPath)
            const contentPath = `/posts/${slug}/content.md`
            const raw = yaml.load(attrRaw) as RawPostAttributes

            const categoryId = raw.category ?? ''
            const tagIds = raw.tags ?? []

            return {
                slug,
                attributes: {
                    title: raw.title,
                    date: raw.date,
                    description: raw.description,
                    cover: raw.cover,
                    // 代號
                    categoryId,
                    tagIds,
                    // 顯示名稱（由 taxonomy 解析）
                    category: resolveCategory(categoryId),
                    tags: tagIds.map(resolveTag),
                },
                content: contentModules[contentPath] ?? '',
            }
        })
        .sort((a, b) => new Date(b.attributes.date).getTime() - new Date(a.attributes.date).getTime())
}

const _posts = buildPosts()

// ── 3. Composable ─────────────────────────────────────────────
export function usePosts() {
    const searchQuery = ref('')
    const activeTag = ref('')        // 以 label 過濾
    const activeCategory = ref('')   // 以 label 過濾

    const allTags = computed(() => {
        const seen = new Set<string>()
        _posts.forEach((p) => p.attributes.tags.forEach((t) => seen.add(t)))
        return [...seen]
    })

    const allCategories = computed(() => {
        const seen = new Set<string>()
        _posts.forEach((p) => seen.add(p.attributes.category))
        return [...seen]
    })

    const filteredPosts = computed(() => {
        return _posts.filter((p) => {
            const q = searchQuery.value.toLowerCase()
            const matchSearch =
                !q ||
                p.attributes.title.toLowerCase().includes(q) ||
                p.attributes.tags.some((t) => t.toLowerCase().includes(q))
            const matchTag = !activeTag.value || p.attributes.tags.includes(activeTag.value)
            const matchCategory =
                !activeCategory.value || p.attributes.category === activeCategory.value
            return matchSearch && matchTag && matchCategory
        })
    })

    function getPost(slug: string): Post | undefined {
        return _posts.find((p) => p.slug === slug)
    }

    function clearFilters() {
        searchQuery.value = ''
        activeTag.value = ''
        activeCategory.value = ''
    }

    return {
        posts: filteredPosts,
        allPosts: _posts,
        allTags,
        allCategories,
        searchQuery,
        activeTag,
        activeCategory,
        getPost,
        clearFilters,
    }
}
