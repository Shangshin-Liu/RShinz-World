// 單一分類 / 標籤項目
export interface TaxonomyItem {
    id: string
    label: string
}

// taxonomy.yaml 的結構
export interface Taxonomy {
    categories: Record<string, { label: string }>
    tags: Record<string, { label: string }>
}

// attributes.yaml（原始，使用代號）
export interface RawPostAttributes {
    title: string
    category: string   // 代號，對應 taxonomy.categories 的 key
    tags: string[]     // 代號陣列，對應 taxonomy.tags 的 key
    date: string
    description?: string
    cover?: string
}

// 解析後（顯示用，代號已轉為 label）
export interface PostAttributes {
    title: string
    categoryId: string    // 原始代號
    category: string      // 顯示名稱（label）
    tagIds: string[]      // 原始代號陣列
    tags: string[]        // 顯示名稱陣列
    date: string
    description?: string
    cover?: string
}

export interface Post {
    slug: string
    attributes: PostAttributes
    content: string
}
