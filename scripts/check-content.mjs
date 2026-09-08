import { readArticles } from './content.mjs'

try {
  const articles = readArticles()
  console.log(`内容校验通过，共 ${articles.length} 篇公开文章。`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
