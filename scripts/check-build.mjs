import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readArticles } from './content.mjs'
import { site } from '../docs/.vitepress/blog.mjs'

const root = fileURLToPath(new URL('../docs/.vitepress/dist/', import.meta.url))
function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(resolve(directory, entry.name)) : [resolve(directory, entry.name)])
}
const files = walk(root)
for (const file of files) {
  assert.ok(!/(?:^|[\\/])(?:_templates|templates|drafts|_drafts)(?:[\\/]|$)/.test(file), `未发布内容进入构建：${file}`)
  if (!file.endsWith('.html')) continue
  const html = readFileSync(file, 'utf8')
  for (const [, attribute, value] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    if (!value || /^(?:[a-z]+:|\/\/|#)/i.test(value)) continue
    const pathname = decodeURIComponent(value.split(/[?#]/)[0])
    let target
    if (pathname.startsWith('/')) {
      assert.ok(pathname.startsWith(site.base), `${file}: ${attribute} 缺少 base：${value}`)
      target = resolve(root, pathname.slice(site.base.length))
    } else target = resolve(dirname(file), pathname)
    if (pathname.endsWith('/')) target = resolve(target, 'index.html')
    assert.ok(existsSync(target), `${file}: 链接或资源不存在：${value}`)
  }
}
for (const route of ['index.html', 'posts/index.html', 'tags/index.html', 'notes/index.html', 'ai/index.html', 'projects/index.html', 'about.html', '404.html', 'robots.txt', 'sitemap.xml']) assert.ok(existsSync(resolve(root, route)), `缺少构建产物：${route}`)
const sitemap = readFileSync(resolve(root, 'sitemap.xml'), 'utf8')
const home = readFileSync(resolve(root, 'index.html'), 'utf8')
const archive = readFileSync(resolve(root, 'posts/index.html'), 'utf8')
for (const post of readArticles()) {
  const url = `${site.base}${post.url.slice(1)}`
  assert.ok(existsSync(resolve(root, post.url.slice(1))), `文章未构建：${post.url}`)
  assert.ok(archive.includes(url), `文章列表缺少：${post.url}`)
  assert.ok(sitemap.includes(`${site.origin}${url}`), `sitemap 缺少：${post.url}`)
}
for (const post of readArticles().slice(0, 6)) assert.ok(home.includes(`${site.base}${post.url.slice(1)}`), `最近文章缺少：${post.url}`)
console.log(`构建产物校验通过：${files.filter((file) => file.endsWith('.html')).length} 个页面，内部链接、资源、文章收录与发布隔离正常。`)
