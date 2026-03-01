export interface PostAttributes {
    title: string
    tags: string[]
    category: string
    date: string
}

export interface Post {
    slug: string
    attributes: PostAttributes
    content: string
}
