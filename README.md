# 梦杰的技术博客

基于 VitePress 的个人技术博客，记录 Agent、RAG 与应用部署中的问题、方案和工程实践。

## 访问与规划

- [博客地址](https://oldsunhead.github.io/tech-blog/)
- [架构、设计规范与版本路线](planning/BLOG_DESIGN.md)（本地规划文件）
- [V1 实现与验收记录](planning/V1_IMPLEMENTATION.md)（本地记录）

V1 使用统一的文章索引，提供首页、全部文章、分类、标签、全文搜索和关于我。保留已有文章地址，使用 GitHub Actions 发布到 GitHub Pages。线上是否更新，以对应工作流的实际结果为准。

## 本地运行

需要 Node.js 22 或以上，CI 使用 Node.js 22。安装依赖后启动：

```bash
npm ci
npm run docs:dev
```

访问命令输出的本机地址，通常是 [本地开发页](http://localhost:5173/tech-blog/)。

## 写作与发布

1. 复制 `templates/article-template.md` 或 `templates/project-template.md`。
2. 放入下面对应栏目，使用小写英文、数字和短横线命名文件及子目录。
3. 填写标题、摘要、真实发布日期、分类、标签和正文。
4. 本地预览，校验并构建。
5. 审阅后提交；推送到 main 会触发现有部署工作流。

| 内容目录 | category 值 | 示例 |
| --- | --- | --- |
| `docs/notes/` | 技术笔记 | `docs/notes/python/async-debugging.md` |
| `docs/ai/` | AI 应用 | `docs/ai/rag/retrieval-debugging.md` |
| `docs/projects/` | 项目实践 | `docs/projects/knowledge-assistant.md` |

首页、文章页、分类和标签入口从同一索引读取，**新增文章不用再手动修改导航或列表链接**。每个栏目的 `index.md` 用于栏目入口，不作为文章。

### 元数据示例

```yaml
---
title: 文章标题
description: 用一到两句话说明问题与结论。
date: 2026-09-08
category: 技术笔记
tags:
  - Python
  - Docker
featured: false
---
```

- 必填：`title`、`description`、`date`、`category`、`tags`。
- `date` 必须是真实日期，不能晚于上海时区的当天；模板日期需改为实际发布日期。
- `updated` 可选，用于实质内容更新，不能早于发布日期或晚于今天。
- `featured: true` 可选，首页最多显示 3 篇精选；默认不精选。
- 日期支持加引号，标签支持多行列表或 YAML 内联列表；推荐沿用模板格式。
- 标签使用一致写法，例如 Python、Agent、RAG、Kubernetes，避免同义词分散。
- 正文包含一个一级标题。保留关键环境、排查证据、验证方法和适用边界。

### 草稿和模板

模板位于根目录 `templates/`，不参与站点构建。未发布稿件可放在根目录 `drafts/`，该目录已被 Git 忽略。

**不要把未公开内容放进 `docs/`。** 该目录中的草稿标记会导致校验失败；模板和草稿目录另有构建排除规则。忽略规则不保护已被 Git 跟踪的文件，公开仓库历史也不适合保存私密笔记。

### 验证命令

```bash
npm run docs:check
npm test
npm run docs:build
npm run docs:preview -- --host 127.0.0.1 --port 4173
```

- `docs:check`：解析 YAML，检查类型、合法日期、目录分类、标签、路径和草稿。
- `test`：验证文章新增 / 删除、稳定排序和发布规则。
- `docs:build`：自动先校验内容，构建后再检查内部链接、资源、文章收录和发布隔离。
- `docs:preview`：浏览生产构建。重新构建后应重启预览服务再刷新，避免旧资源缓存。

当前构建产物位于 `docs/.vitepress/dist/`，不提交到 Git。

## 目录与职责

```text
docs/
├── .vitepress/
│   ├── blog.mjs              # 站点地址与分类配置
│   ├── search.mjs            # 构建和浏览器共用的中英文分词
│   ├── config.mts            # 搜索、导航、SEO 与构建配置
│   └── theme/
│       ├── posts.data.ts     # 文章数据与 Markdown 变更监听
│       ├── components/       # 列表、筛选、空状态和阅读布局
│       └── styles/blog.css   # 全站设计变量与样式
├── posts/                    # 全部文章
├── tags/                     # 标签和可分享的筛选 URL
├── notes/                    # 技术笔记
├── ai/                       # AI 应用
├── projects/                 # 项目实践
├── about.md
└── index.md
scripts/
├── content.mjs               # 统一文章读取与校验
├── check-content.mjs
├── content.test.mjs
└── check-build.mjs
templates/                    # 问题复盘、项目实践模板
```

## 设计与扩展

界面使用 Naive UI 2.45.3，统一样式维护在 `docs/.vitepress/theme/styles/blog.css`，组件主题维护在 `docs/.vitepress/theme/naive.ts`。视觉采用浅灰背景、白色卡片、墨绿强调色与分栏布局，并适配深浅色。

新增页面优先复用 `PostList`、`ArticleExplorer`、`EmptyState`、`BlogSidebar`，交互组件优先使用 Naive UI 的 `NButton`、`NCard`、`NTag` 等。正文渲染、导航、目录和全文搜索继续使用 VitePress。构建时通过 `@css-render/vue3-ssr` 收集组件样式并写入 HTML head，保证静态首屏已有样式。

- 修改主色、字号、间距或布局时，同步更新规划文档。
- 增加元数据时，同步修改 `content.mjs`、数据类型、模板和本文。
- 全部文章按首次发布日期降序，同日按 URL 稳定排序。
- 标签使用 `/tags/?tag=...`，分类筛选使用查询参数；筛选可复制链接、刷新和前进后退。
- 中文搜索使用相邻双字切分，英文使用词项；标题、正文、摘要和标签都参与索引。它是关键词检索，不提供语义问答。

V2 的专题和 RSS、V3 的项目展示增强、V4 的 AI 问答按规划中的条件启动。

## 部署与回滚

工作流在 main 推送或手动触发时执行：

```text
检出完整历史 -> npm ci -> npm test -> npm run docs:build
    -> 上传静态产物 -> GitHub Pages 发布
```

仓库需要在 GitHub 中启用 Pages，并选择 GitHub Actions 作为发布来源。工作流已配置，首次发布应检查实际运行状态及线上代表页面。

站点地址和基础路径统一维护在 `docs/.vitepress/blog.mjs`。canonical、sitemap 和构建生成的 robots.txt 共用此配置。调整域名或基础路径后，重新验证旧地址兼容、分享信息与静态资源。

发生问题时，通过审阅后的回退提交恢复已验证版本并重新部署；保留文章路径，避免直接改名导致旧链接失效。
