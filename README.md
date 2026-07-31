# 纳兰斯坦、爱因容若的未晚斋

基于 [Astro](https://astro.build/) 与
[Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus) 的个人博客，使用
GitHub Actions 自动部署到 GitHub Pages。

博客地址：[https://blog.nalansitan.com](https://blog.nalansitan.com)

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
lang: "zh-CN"
route: "article-route"
translationKey: "article-key"
publishDate: 2026-07-30
tags: ["Astro", "博客"]
draft: false
pinned: false
---

正文内容。
```

其中：

- `title`、`description`、`lang`、`route`、`translationKey` 和 `publishDate` 为必填字段。
- `title` 最长 60 个字符。
- `route` 决定文章 URL，例如 `article-route` 对应 `/posts/article-route/`。
- `tags` 会自动转为小写并去重。
- `draft: true` 的文章可在本地预览，但不会出现在生产网站中。
- `pinned: true` 会将文章显示在首页和文章列表的置顶区域。
- 更新文章时可以添加 `updatedDate`。
- 文章还支持 `coverImage` 和 `ogImage`：

```yaml
updatedDate: 2026-07-31
coverImage:
  src: "../../src/assets/example.jpg"
  alt: "图片说明"
ogImage: "/images/custom-social-card.png"
```

提交到 `main` 分支后，GitHub Actions 会自动构建并发布网站。

### 写随笔

短随笔放在 `content/notes/`：

```markdown
---
title: "随笔标题"
description: "随笔摘要"
lang: "zh-CN"
route: "note-route"
translationKey: "note-key"
publishDate: 2026-07-30T17:00:00+08:00
---

随笔内容。
```

`description` 可以省略，其他示例字段均为必填字段。

### 写标签介绍

标签介绍放在 `content/tags/`：

```markdown
---
title: "标签名称"
description: "标签介绍"
lang: "zh-CN"
route: "tag-route"
translationKey: "tag-key"
---
```

`description` 可以省略，其他示例字段均为必填字段。文章中的标签名称应与对应标签的
`route` 一致。

## 多语言内容

中文使用原有 URL，英文页面使用 `/en/` 前缀。每份文章、随笔和标签介绍都需要声明语言、
固定路由和翻译关联：

```yaml
lang: "zh-CN" # 英文使用 "en"
route: "hello-world"
translationKey: "hello-world"
```

同一内容的中英文版本使用相同的 `translationKey`，文件名必须不同。`route` 可以按语言分别设置，
语言切换器会通过 `translationKey` 找到正确译文。英文文件建议使用 `en-` 前缀，例如
`hello-world.md` 与 `en-hello-world.md`。界面翻译集中在 `src/i18n.ts`。

运行 `pnpm build` 时会同时生成 Pagefind 搜索索引、RSS、Sitemap、PWA Manifest 与文章社交分享图。

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
