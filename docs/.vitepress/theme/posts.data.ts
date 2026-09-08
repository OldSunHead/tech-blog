import { readArticles } from '../../../scripts/content.mjs'

export interface Post {
  title: string
  description: string
  date: string
  updated: string | null
  category: string
  tags: string[]
  featured: boolean
  url: string
}

declare const data: Post[]
export { data }

export default {
  watch: ['../../**/*.md'],
  load: () => readArticles()
}
