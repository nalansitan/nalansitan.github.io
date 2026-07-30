import rss from "@astrojs/rss";
import { getAllPosts } from "@/data/post";
import { defaultLocale, type Locale, localizePath, ui } from "@/i18n";
import { siteConfig } from "@/site.config";

export const getPostsRss = async (locale: Locale) => {
	const posts = await getAllPosts(locale);

	return rss({
		title: `${siteConfig.title} — ${ui[locale].articles}`,
		description: locale === "en" ? ui.en.homeIntro : siteConfig.description,
		site: new URL(localizePath("/", locale), import.meta.env.SITE),
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.publishDate,
			link: localizePath(`/posts/${post.data.route}/`, locale),
		})),
	});
};

export const GET = () => getPostsRss(defaultLocale);
