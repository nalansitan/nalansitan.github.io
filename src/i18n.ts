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
		about: "关于",
		aboutDescription: "关于 Nalansitan 和这个博客。",
		allTags: "全部标签",
		articles: "文章",
		articlesDescription: "阅读我的技术文章、学习记录与深度思考。",
		backToTop: "返回顶部",
		draft: "（草稿）",
		findMe: "在这里找到我",
		greeting: "你好，我是 Nalansitan。",
		home: "首页",
		homeIntro: "记录技术实践、阅读所得，以及那些值得反复思考的问题。",
		homeMotto: "保持好奇，",
		homeMottoEmphasis: "持续构建。",
		language: "语言",
		next: "下一页 →",
		notes: "随笔",
		notesDescription: "简短的随笔、想法与日常记录。",
		openMenu: "打开主菜单",
		pinnedPosts: "置顶文章",
		previous: "← 上一页",
		rss: "RSS 订阅",
		search: "搜索",
		skipToContent: "跳到正文",
		tags: "标签",
		tagsDescription: "按主题浏览全部文章。",
		toc: "目录",
		viewAll: "查看全部",
		viewTag: "查看这个标签下的全部文章",
		year: "文章年份",
	},
	en: {
		about: "About",
		aboutDescription: "About Nalansitan and this blog.",
		allTags: "All tags",
		articles: "Posts",
		articlesDescription: "Read my technical articles, learning notes, and longer reflections.",
		backToTop: "Back to top",
		draft: " (Draft)",
		findMe: "Find me online",
		greeting: "Hi, I’m Nalansitan.",
		home: "Home",
		homeIntro: "I write about building software, reading, and ideas worth revisiting.",
		homeMotto: "Stay curious, ",
		homeMottoEmphasis: "keep building.",
		language: "Language",
		next: "Next →",
		notes: "Notes",
		notesDescription: "Short notes, ideas, and everyday observations.",
		openMenu: "Open main menu",
		pinnedPosts: "Pinned posts",
		previous: "← Previous",
		rss: "RSS feed",
		search: "Search",
		skipToContent: "Skip to content",
		tags: "Tags",
		tagsDescription: "Browse all posts by topic.",
		toc: "Table of contents",
		viewAll: "View all",
		viewTag: "View all posts with this tag",
		year: "Post year",
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
