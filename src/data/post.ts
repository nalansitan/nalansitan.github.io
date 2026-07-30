import { type CollectionEntry, getCollection } from "astro:content";
import { defaultLocale, type Locale } from "@/i18n";

/** filter out draft posts based on the environment */
export async function getAllPosts(
	locale: Locale = defaultLocale,
): Promise<CollectionEntry<"post">[]> {
	return await getCollection("post", ({ data }) => {
		return data.lang === locale && (import.meta.env.PROD ? !data.draft : true);
	});
}

export async function getAllNotes(
	locale: Locale = defaultLocale,
): Promise<CollectionEntry<"note">[]> {
	return await getCollection("note", ({ data }) => data.lang === locale);
}

/** Get tag metadata by tag name */
export async function getTagMeta(
	tag: string,
	locale: Locale = defaultLocale,
): Promise<CollectionEntry<"tag"> | undefined> {
	const tagEntries = await getCollection("tag", (entry) => {
		return entry.data.lang === locale && entry.data.route === tag;
	});
	return tagEntries[0];
}

export async function getTranslatedPost(translationKey: string, locale: Locale) {
	const posts = await getAllPosts(locale);
	return posts.find((entry) => entry.data.translationKey === translationKey);
}

export async function getTranslatedNote(translationKey: string, locale: Locale) {
	const notes = await getAllNotes(locale);
	return notes.find((entry) => entry.data.translationKey === translationKey);
}

export async function getTranslatedTag(translationKey: string, locale: Locale) {
	const tags = await getCollection("tag", ({ data }) => data.lang === locale);
	return tags.find((entry) => entry.data.translationKey === translationKey);
}

/** groups posts by year (based on option siteConfig.sortPostsByUpdatedDate), using the year as the key
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 */
export function groupPostsByYear(posts: CollectionEntry<"post">[]) {
	return Object.groupBy(posts, (post) => post.data.publishDate.getFullYear().toString());
}

/** returns all tags created from posts (inc duplicate tags)
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getAllTags(posts: CollectionEntry<"post">[]) {
	return posts.flatMap((post) => [...post.data.tags]);
}

/** returns all unique tags created from posts
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getUniqueTags(posts: CollectionEntry<"post">[]) {
	return [...new Set(getAllTags(posts))];
}

/** returns a count of each unique tag - [[tagName, count], ...]
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getUniqueTagsWithCount(posts: CollectionEntry<"post">[]): [string, number][] {
	return [
		...getAllTags(posts).reduce(
			(acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1),
			new Map<string, number>(),
		),
	].sort((a, b) => b[1] - a[1]);
}
