export const locales = ["zh-CN", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh-CN";

export const localeConfig = {
	"zh-CN": {
		label: "中文",
		ogLocale: "zh_CN",
		prefix: "",
	},
	en: {
		label: "English",
		ogLocale: "en_US",
		prefix: "/en",
	},
} as const;

export const ui = {
	"zh-CN": {
		about: "关于我",
		aboutDescription: "关于纳兰斯坦、爱因容若和这个博客。",
		allTags: "全部标签",
		articles: "文章",
		articlesDescription: "阅读我的技术文章、学习记录与深度思考。",
		backToTop: "返回顶部",
		copyFallback: "无法自动复制，链接已选中，请手动复制。",
		copyLink: "复制链接",
		feedbackSuggestions: "反馈与建议",
		draft: "（草稿）",
		findMe: "在这里关注我",
		greeting: "你好，我是纳兰斯坦、爱因容若。",
		home: "首页",
		homeIntro: "记录技术实践、阅读所得，以及那些值得反复思考的问题。",
		homeMottoLines: ["保持好奇，持续构建。", "深入思考，洞见幽微。", "以文载思，向新而行。"],
		language: "语言",
		next: "下一页 →",
		notes: "随笔",
		notesDescription: "简短的随笔、想法与日常记录。",
		openMenu: "打开主菜单",
		pageLink: "页面链接",
		pinnedPosts: "置顶文章",
		previous: "← 上一页",
		rss: "RSS 订阅",
		search: "搜索",
		seoDescription:
			"纳兰斯坦（Nalansitan）与爱因容若的个人博客，记录技术实践、阅读所得，以及那些值得反复思考的问题。",
		share: "分享",
		skipToContent: "跳到正文",
		tags: "标签",
		tagsDescription: "按主题浏览全部文章。",
		toc: "目录",
		viewAll: "查看全部",
		viewTag: "查看这个标签下的全部文章",
		year: "文章年份",
		linkCopied: "链接已复制。",
	},
	en: {
		about: "About Me",
		aboutDescription: "About 纳兰斯坦、爱因容若 and this blog.",
		allTags: "All tags",
		articles: "Posts",
		articlesDescription: "Read my technical articles, learning notes, and longer reflections.",
		backToTop: "Back to top",
		copyFallback: "Automatic copy failed. The link is selected for manual copying.",
		copyLink: "Copy link",
		feedbackSuggestions: "Feedback & suggestions",
		draft: " (Draft)",
		findMe: "Find me online",
		greeting: "Hi, I’m Nalansitan（纳兰斯坦）.",
		home: "Home",
		homeIntro: "I write about building software, reading, and ideas worth revisiting.",
		homeMottoLines: [
			"Stay curious, keep building.",
			"Think deeply, discern the subtle.",
			"Carry thought through writing; move toward what’s new.",
		],
		language: "Language",
		next: "Next →",
		notes: "Notes",
		notesDescription: "Short notes, ideas, and everyday observations.",
		openMenu: "Open main menu",
		pageLink: "Page link",
		pinnedPosts: "Pinned posts",
		previous: "← Previous",
		rss: "RSS feed",
		search: "Search",
		seoDescription:
			"Nalansitan’s personal blog for software engineering, internet technology, reading, growth, and ideas worth revisiting.",
		share: "Share",
		skipToContent: "Skip to content",
		tags: "Tags",
		tagsDescription: "Browse all posts by topic.",
		toc: "Table of contents",
		viewAll: "View all",
		viewTag: "View all posts with this tag",
		year: "Post year",
		linkCopied: "Link copied.",
	},
} as const;

export function getLocaleFromUrl(url: URL): Locale {
	return url.pathname === "/en" || url.pathname.startsWith("/en/") ? "en" : defaultLocale;
}

export function localizePath(path: string, locale: Locale): string {
	const normalized = path.startsWith("/") ? path : `/${path}`;
	if (locale === defaultLocale) return normalized;
	if (normalized === "/") return `${localeConfig[locale].prefix}/`;
	return `${localeConfig[locale].prefix}${normalized}`;
}

export function switchLocalePath(path: string, locale: Locale): string {
	const withoutEnglishPrefix = path.replace(/^\/en(?=\/|$)/, "") || "/";
	return localizePath(withoutEnglishPrefix, locale);
}
