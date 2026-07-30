import rss from "@astrojs/rss";
import { getAllNotes } from "@/data/post";
import { defaultLocale, type Locale, localizePath, ui } from "@/i18n";
import { siteConfig } from "@/site.config";

export const getNotesRss = async (locale: Locale) => {
	const notes = await getAllNotes(locale);

	return rss({
		title: `${siteConfig.title} — ${ui[locale].notes}`,
		description: ui[locale].notesDescription,
		site: new URL(localizePath("/", locale), import.meta.env.SITE),
		items: notes.map((note) => ({
			title: note.data.title,
			pubDate: note.data.publishDate,
			link: localizePath(`/notes/${note.data.route}/`, locale),
		})),
	});
};

export const GET = () => getNotesRss(defaultLocale);
