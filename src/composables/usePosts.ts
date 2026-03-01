import { ref, computed } from 'vue'
import yaml from 'js-yaml'
import type { Post, PostAttributes } from '@/types'

// Build-time glob — Vite 打包時掃描所有 attributes.yaml 與 content.md
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
    // /posts/{slug}/attributes.yaml → {slug}
    const match = path.match(/\/posts\/(.+)\/attributes\.yaml$/)
    return match ? match[1] : path
}

function buildPosts(): Post[] {
    return Object.entries(attrModules)
        .map(([attrPath, attrRaw]) => {
            const slug = parseSlug(attrPath)
            const contentPath = `/posts/${slug}/content.md`
            const attributes = yaml.load(attrRaw) as PostAttributes

            return {
                slug,
                attributes: {
                    ...attributes,
                    tags: attributes.tags ?? [],
                },
                content: contentModules[contentPath] ?? '',
            }
        })
        .sort((a, b) => new Date(b.attributes.date).getTime() - new Date(a.attributes.date).getTime())
}

const _posts = buildPosts()

export function usePosts() {
    const searchQuery = ref('')
    const activeTag = ref('')
    const activeCategory = ref('')

    const allTags = computed(() => {
        const tagSet = new Set<string>()
        _posts.forEach((p) => p.attributes.tags.forEach((t) => tagSet.add(t)))
        return [...tagSet]
    })

    const allCategories = computed(() => {
        const catSet = new Set<string>()
        _posts.forEach((p) => catSet.add(p.attributes.category))
        return [...catSet]
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
