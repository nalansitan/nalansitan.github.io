import type { APIContext, InferGetStaticPropsType } from "astro";
import satori, { type SatoriOptions } from "satori";
import sharp from "sharp";
import LxgwWenKaiLite from "@/assets/lxgw-wenkai-lite.ttf";
import { getAllPosts } from "@/data/post";
import { defaultLocale, type Locale } from "@/i18n";
import { getFormattedDate } from "@/utils/date";
import { readCache, writeToCache } from "./_cacheUtil";
import { ogMarkup } from "./_ogMarkup";

const ogOptions: SatoriOptions = {
	// debug: true,
	fonts: [
		{
			data: Buffer.from(LxgwWenKaiLite),
			name: "LXGW WenKai Lite",
			style: "normal",
			weight: 400,
		},
		{
			data: Buffer.from(LxgwWenKaiLite),
			name: "LXGW WenKai Lite",
			style: "normal",
			weight: 700,
		},
	],
	height: 630,
	width: 1200,
};

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
	const { locale, pubDate, title } = context.props as Props;

	// check the og-image cache
	let pngBuffer = readCache(title, pubDate);
	if (!pngBuffer) {
		console.info(`Generating new OG image for: ${title}`);
		const postDate = getFormattedDate(
			pubDate,
			{
				month: "long",
				weekday: "long",
			},
			locale,
		);
		const svg = await satori(ogMarkup(title, postDate, locale), ogOptions);
		pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
		writeToCache(title, pubDate, pngBuffer);
	}

	return new Response(new Uint8Array(pngBuffer), {
		headers: {
			"Cache-Control": "public, max-age=31536000, immutable",
			"Content-Type": "image/png",
		},
	});
}

export async function getOgImagePaths(locale: Locale) {
	const posts = await getAllPosts(locale);
	return posts
		.values()
		.filter(({ data }) => !data.ogImage)
		.map((post) => ({
			params: { slug: post.data.route },
			props: {
				locale,
				pubDate: post.data.updatedDate ?? post.data.publishDate,
				title: post.data.title,
			},
		}))
		.toArray();
}

export const getStaticPaths = () => getOgImagePaths(defaultLocale);
