import { createContentLoader } from 'vitepress'

function formatDate(date: Date | string) {
  return new Date(date).toISOString().slice(0, 10)
}

export default createContentLoader(
  [
    'notes/**/*.md',
    'ai/**/*.md',
    'projects/**/*.md'
  ],
  {
    excerpt: true,
    transform(raw) {
      return raw
        .filter((page) => page.frontmatter?.date)
        .map((page) => ({
          title: page.frontmatter.title,
          description: page.frontmatter.description,
          date: formatDate(page.frontmatter.date),
          category: page.frontmatter.category,
          tags: page.frontmatter.tags ?? [],
          url: page.url
        }))
        .sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
        )
    }
  }
)
