# Nalansitan Blog

基于 [Astro](https://astro.build/) 的个人博客，使用 GitHub Actions 自动部署到 GitHub Pages。

## 本地开发

```bash
pnpm install
pnpm dev
```

本地地址默认为 `http://localhost:4321`。

## 写文章

在 `src/content/posts/` 新建 Markdown 文件：

```markdown
---
title: "文章标题"
description: "文章摘要"
pubDate: 2026-07-30
tags: ["Astro", "博客"]
draft: false
---

正文内容。
```

提交到 `main` 分支后，GitHub Actions 会自动构建并发布网站。
