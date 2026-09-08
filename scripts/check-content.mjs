import { readdir, readFile } from 'node:fs/promises'
import { resolve, relative } from 'node:path'

const docsRoot = resolve('docs')
const articleDirectories = ['notes', 'ai', 'projects']
const requiredFields = ['title', 'description', 'date', 'category']
const errors = []

async function* walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name)

    if (entry.isDirectory()) {
      yield* walk(path)
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      yield path
    }
  }
}

function getFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return match?.[1]
}

function hasField(frontmatter, field) {
  return new RegExp(`^${field}:\\s*\\S`, 'm').test(frontmatter)
}

for (const directory of articleDirectories) {
  for await (const file of walk(resolve(docsRoot, directory))) {
    if (file.endsWith('index.md')) continue

    const source = await readFile(file, 'utf8')
    const filePath = relative(process.cwd(), file)
    const frontmatter = getFrontmatter(source)

    if (!frontmatter) {
      errors.push(`${filePath}: 缺少 YAML frontmatter。`)
      continue
    }

    for (const field of requiredFields) {
      if (!hasField(frontmatter, field)) {
        errors.push(`${filePath}: 缺少必填字段 ${field}。`)
      }
    }

    if (!/^date:\s*\d{4}-\d{2}-\d{2}\s*$/m.test(frontmatter)) {
      errors.push(`${filePath}: date 必须使用 YYYY-MM-DD 格式。`)
    }

    if (!/^tags:\s*\r?\n(?:\s+-\s+\S+\r?\n?)+/m.test(frontmatter)) {
      errors.push(`${filePath}: tags 必须是至少包含一个标签的 YAML 列表。`)
    }

    if (!/^#\s+\S/m.test(source.replace(/^---[\s\S]*?---\r?\n/, ''))) {
      errors.push(`${filePath}: 缺少一级标题。`)
    }
  }
}

if (errors.length > 0) {
  console.error('内容校验失败：')
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log('内容校验通过。')
}
