import { readdirSync, readFileSync } from 'node:fs'
import { basename, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseDocument } from 'yaml'
import { categories } from '../docs/.vitepress/blog.mjs'

export const docsRoot = fileURLToPath(new URL('../docs/', import.meta.url))

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.') || entry.name === 'public') return []
    const path = resolve(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`站点内容不允许符号链接：${path}`)
    return entry.isDirectory() ? walk(path) : entry.name.endsWith('.md') ? [path] : []
  })
}

export function parseMarkdown(source, path) {
  const match = source.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) throw new Error(`${path}: 缺少 YAML frontmatter。`)
  const document = parseDocument(match[1], { uniqueKeys: true })
  if (document.errors.length) throw new Error(`${path}: YAML 无效：${document.errors[0].message}`)
  const metadata = document.toJS()
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) throw new Error(`${path}: frontmatter 必须是字段映射。`)
  return { metadata, body: source.slice(match[0].length) }
}

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

export function validateArticle(metadata, body, path, today) {
  const errors = []
  const category = categories.find((item) => path.startsWith(`${item.id}/`))
  for (const field of ['title', 'description']) {
    if (typeof metadata[field] !== 'string' || !metadata[field].trim()) errors.push(`${field} 必须是非空字符串`)
  }
  if (!category || metadata.category !== category.name) errors.push(`category 必须与目录对应：${category?.name ?? '未知栏目'}`)
  if (!validDate(metadata.date)) errors.push('date 必须是真实的 YYYY-MM-DD 日期')
  else if (metadata.date > today) errors.push('date 不能晚于今天；V1 不支持预约发布')
  if (metadata.updated !== undefined) {
    if (!validDate(metadata.updated)) errors.push('updated 必须是真实的 YYYY-MM-DD 日期')
    else if (metadata.updated < metadata.date || metadata.updated > today) errors.push('updated 必须介于发布日期与今天之间')
  }
  if (!Array.isArray(metadata.tags) || !metadata.tags.length || metadata.tags.some((tag) => typeof tag !== 'string' || !tag.trim())) {
    errors.push('tags 必须是非空字符串列表')
  } else if (new Set(metadata.tags.map((tag) => tag.trim().toLowerCase())).size !== metadata.tags.length) {
    errors.push('tags 不能包含重复标签')
  }
  if (metadata.featured !== undefined && typeof metadata.featured !== 'boolean') errors.push('featured 必须是布尔值')
  if (metadata.draft !== undefined && metadata.draft !== false) errors.push('草稿请移到根目录 drafts/，不支持在 docs/ 中发布草稿')
  if (!/^#\s+\S/m.test(body.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, ''))) errors.push('缺少一级标题')
  if (!/^[a-z0-9-]+(?:\/[a-z0-9-]+)*\.md$/.test(path)) errors.push('文章路径必须使用小写英文、数字与短横线')
  return errors.map((error) => `${path}: ${error}。`)
}

// One index powers validation, page metadata and every article list.
export function readArticles(root = docsRoot, today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' }).format(new Date())) {
  const articles = []
  const errors = []
  const urls = new Set()
  for (const file of walk(root)) {
    const path = relative(root, file).replaceAll('\\', '/')
    try {
      if (path.split('/').some((part) => ['drafts', '_drafts', 'templates', '_templates'].includes(part))) throw new Error(`${path}: 草稿和模板必须放在 docs/ 之外。`)
      const { metadata, body } = parseMarkdown(readFileSync(file, 'utf8'), path)
      if (metadata.draft !== undefined && metadata.draft !== false) throw new Error(`${path}: 不允许构建草稿，请移出 docs/。`)
      if (!categories.some((item) => path.startsWith(`${item.id}/`)) || basename(path) === 'index.md') continue
      const issues = validateArticle(metadata, body, path, today)
      errors.push(...issues)
      const url = `/${path.replace(/\.md$/, '.html')}`
      if (urls.has(url.toLowerCase())) errors.push(`${path}: 文章路径重复。`)
      urls.add(url.toLowerCase())
      if (issues.length) continue
      articles.push({
        title: metadata.title.trim(), description: metadata.description.trim(),
        date: metadata.date, updated: metadata.updated ?? null,
        category: metadata.category, tags: metadata.tags.map((tag) => tag.trim()),
        featured: metadata.featured ?? false, url
      })
    } catch (error) { errors.push(error.message) }
  }
  if (errors.length) throw new Error(`内容校验失败：\n${errors.map((error) => `- ${error}`).join('\n')}`)
  return articles.sort((a, b) => b.date.localeCompare(a.date) || a.url.localeCompare(b.url))
}
