import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve, basename } from 'node:path'
import { parseMarkdown, readArticles, validateArticle } from './content.mjs'

const today = '2026-09-08'
const valid = { title: '文章', description: '摘要', date: today, category: '技术笔记', tags: ['Git'] }
const validate = (changes, body = '# 文章') => validateArticle({ ...valid, ...changes }, body, 'notes/example.md', today)

test('accepts valid YAML, real dates and optional article metadata', () => {
  const { metadata } = parseMarkdown('---\ntitle: 文章\ndate: "2024-02-29"\ntags: [Git, Python]\n---\n# 文章', 'example.md')
  assert.equal(metadata.date, '2024-02-29')
  assert.deepEqual(metadata.tags, ['Git', 'Python'])
  assert.deepEqual(validate({ date: metadata.date, updated: today, featured: true }), [])
})

test('rejects impossible dates, future publication and invalid update order', () => {
  for (const date of ['2025-02-29', '2026-02-30', '2026-13-01', '2027-01-01', 20260908]) assert.ok(validate({ date }).length)
  assert.ok(validate({ updated: '2026-09-07' }).length)
  assert.ok(validate({ updated: '2027-01-01' }).length)
})

test('rejects malformed metadata and headings that exist only inside code', () => {
  for (const changes of [{ title: ' ' }, { category: 'Git' }, { tags: [] }, { tags: ['Git', 'git'] }, { tags: [7] }, { featured: 'true' }, { draft: true }]) assert.ok(validate(changes).length)
  assert.ok(validate({}, '```bash\n# comment\n```').length)
  assert.throws(() => parseMarkdown('---\ntitle: a\ntitle: b\n---\n# a', 'a.md'), /YAML/)
})

test('discovers additions and deletions, sorts stably, and blocks unpublished content', () => {
  const root = mkdtempSync(join(tmpdir(), 'tech-blog-content-'))
  mkdirSync(join(root, 'notes'))
  const source = (title) => `---\ntitle: ${title}\ndescription: 摘要\ndate: ${today}\ncategory: 技术笔记\ntags: [Git]\n---\n# ${title}\n`
  try {
    writeFileSync(join(root, 'notes', 'b.md'), source('B'))
    writeFileSync(join(root, 'notes', 'a.md'), source('A'))
    assert.deepEqual(readArticles(root, today).map((post) => post.url), ['/notes/a.html', '/notes/b.html'])
    rmSync(join(root, 'notes', 'a.md'))
    assert.equal(readArticles(root, today).length, 1)
    writeFileSync(join(root, 'notes', 'b.md'), source('B').replace('tags:', 'draft: true\ntags:'))
    assert.throws(() => readArticles(root, today), /不允许构建草稿/)
    writeFileSync(join(root, 'notes', 'b.md'), source('B'))
    mkdirSync(join(root, '_templates'))
    writeFileSync(join(root, '_templates', 'example.md'), source('模板'))
    assert.throws(() => readArticles(root, today), /草稿和模板必须/)
  } finally {
    assert.equal(dirname(resolve(root)), resolve(tmpdir()))
    assert.ok(basename(root).startsWith('tech-blog-content-'))
    rmSync(root, { recursive: true, force: true })
  }
})

test('the actual repository contains valid published articles', () => {
  assert.ok(Array.isArray(readArticles()))
})
