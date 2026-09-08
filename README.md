# 梦杰的技术博客

个人技术博客，用于记录开发过程中遇到的问题、解决方案、项目实践以及 AI & Agent 相关技术探索。

博客基于 VitePress 构建，并通过 GitHub Actions 自动部署到 GitHub Pages。

## 在线访问

博客地址：

https://oldsunhead.github.io/tech-blog/

## 技术栈

- VitePress
- Markdown
- Node.js
- Git / GitHub
- GitHub Actions
- GitHub Pages

## 内容分类

目前博客主要分为以下几个部分：

### 技术笔记

记录日常开发过程中遇到的问题及解决方案。

主要包括：

- Git
- Docker
- Linux
- Java
- Python

### AI & Agent

记录 AI 与 Agent 相关技术探索。

主要包括：

- LLM
- Agent
- MCP
- RAG

### 项目实践

记录实际项目中的技术方案、架构设计、部署过程以及问题排查经验。

---

## 项目结构

```text
tech-blog/
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── docs/
│   ├── .vitepress/
│   │   └── config.mts
│   │
│   ├── notes/
│   │   ├── index.md
│   │   └── git/
│   │       └── git-pull-divergent-branches.md
│   │
│   ├── ai/
│   │   └── index.md
│   │
│   ├── projects/
│   │   └── index.md
│   │
│   └── index.md
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## 本地运行

克隆项目：

```bash
git clone https://github.com/OldSunHead/tech-blog.git
```

进入项目：

```bash
cd tech-blog
```

安装依赖：

```bash
npm install
```

启动 VitePress：

```bash
npm run docs:dev
```

启动成功后，根据终端提示访问本地地址，例如：

```text
http://localhost:5173/tech-blog/
```

## 新增文章

文章统一使用 Markdown 编写。

例如新增一篇 Git 技术笔记：

```text
docs/notes/git/example.md
```

然后在：

```text
docs/.vitepress/config.mts
```

中配置对应的 Sidebar 导航。

修改完成后先在本地运行：

```bash
npm run docs:dev
```

确认页面显示正常。

## 发布流程

项目使用 GitHub Actions + GitHub Pages 自动部署。

本地修改完成并确认无误后：

```bash
git status
git add .
git commit -m "add new article"
git push
```

代码 push 到 `main` 分支后，GitHub Actions 会自动：

1. 安装依赖
2. 构建 VitePress
3. 生成静态页面
4. 部署到 GitHub Pages

因此不需要手动上传构建后的文件。

## 构建

本地构建：

```bash
npm run docs:build
```

构建产物默认生成在：

```text
docs/.vitepress/dist/
```

该目录属于构建产物，不提交到 Git 仓库。

## Git 忽略目录

项目 `.gitignore` 中忽略：

```gitignore
node_modules/
docs/.vitepress/cache/
docs/.vitepress/dist/
```

## 维护说明

日常推荐工作流程：

```text
git pull
   ↓
新增 / 修改 Markdown
   ↓
npm run docs:dev
   ↓
本地浏览器检查
   ↓
git add .
   ↓
git commit
   ↓
git push
   ↓
GitHub Actions
   ↓
自动发布 GitHub Pages
```

---

持续学习，持续实践，持续沉淀。