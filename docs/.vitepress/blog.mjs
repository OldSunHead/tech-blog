export const categories = [
  { id: 'notes', name: '技术笔记', description: '开发中的问题、排查过程与可复用的解决方案。' },
  { id: 'ai', name: 'AI 应用', description: 'Agent、RAG 与大模型应用的工程实践。' },
  { id: 'projects', name: '项目实践', description: '从问题与约束出发，记录架构、取舍和验证。' }
]

export const site = {
  title: '梦杰的技术博客',
  description: '记录 Agent、RAG 与应用部署中的问题、方案和工程实践。',
  origin: 'https://oldsunhead.github.io',
  base: '/tech-blog/',
  github: 'https://github.com/OldSunHead'
}

export function categoryUrl(category) {
  return `/${categories.find((item) => item.name === category)?.id ?? 'posts'}/`
}

export function tagUrl(tag) {
  return `/tags/?tag=${encodeURIComponent(tag)}`
}
