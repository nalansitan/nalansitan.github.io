# Nalansitan Blog

基于 [Astro](https://astro.build/) 与
[Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus) 的个人博客，使用
GitHub Actions 自动部署到 GitHub Pages。

## 本地开发

```bash
pnpm install
pnpm dev
```

本地地址默认为 `http://localhost:4321`。

## 写文章

在 `content/posts/` 新建 Markdown 文件：

```markdown
---
title: "文章标题"
description: "文章摘要"
publishDate: 2026-07-30
tags: ["Astro", "博客"]
draft: false
---

正文内容。
```

提交到 `main` 分支后，GitHub Actions 会自动构建并发布网站。

短随笔放在 `content/notes/`，标签介绍放在 `content/tags/`。运行 `pnpm build`
时会同时生成 Pagefind 搜索索引、RSS、Sitemap、PWA Manifest 与文章社交分享图。

## 多语言内容

中文使用原有 URL，英文页面使用 `/en/` 前缀。每份内容需要声明语言、固定路由和翻译关联：

```yaml
lang: "zh-CN" # 英文使用 "en"
route: "hello-world"
translationKey: "hello-world"
```

同一内容的中英文版本使用相同的 `translationKey`，文件名必须不同。`route` 可以按语言分别设置，
语言切换器会通过 `translationKey` 找到正确译文。界面翻译集中在 `src/i18n.ts`。

## 常用命令

```bash
pnpm dev       # 开发服务器
pnpm check     # Astro 与 Biome 检查
pnpm build     # 生产构建与搜索索引
pnpm test      # 完整验收
```

## 主题许可

Astro Cactus 以 MIT License 发布，版权归原作者 Chris Williams 所有。许可文本见
`LICENSE`。

文章分享图使用的霞鹜文楷轻便版以 SIL Open Font License 1.1 发布，许可文本见
`LICENSE-LXGW-WenKai`。
