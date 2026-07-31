import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
assert.match(packageJson.packageManager, /^pnpm@/);
assert.doesNotMatch(JSON.stringify(packageJson.scripts), /\bnpm\b/);
await access("pnpm-lock.yaml");
await assert.rejects(access("package-lock.json"));

const workflow = await readFile(".github/workflows/deploy.yml", "utf8");
assert.match(workflow, /pnpm\/action-setup/);
assert.match(workflow, /run: pnpm install --frozen-lockfile/);
assert.match(workflow, /run: pnpm test/);

const requiredFiles = [
	"dist/index.html",
	"dist/about/index.html",
	"dist/404.html",
	"dist/posts/index.html",
	"dist/posts/hello-world/index.html",
	"dist/notes/index.html",
	"dist/notes/welcome/index.html",
	"dist/tags/index.html",
	"dist/rss.xml",
	"dist/notes/rss.xml",
	"dist/robots.txt",
	"dist/sitemap-index.xml",
	"dist/manifest.webmanifest",
	"dist/pagefind/pagefind.js",
	"dist/og-image/hello-world.png",
	"dist/en/index.html",
	"dist/en/404/index.html",
	"dist/en/about/index.html",
	"dist/en/posts/index.html",
	"dist/en/posts/hello-world/index.html",
	"dist/en/notes/index.html",
	"dist/en/notes/welcome/index.html",
	"dist/en/tags/index.html",
	"dist/en/tags/astro/index.html",
	"dist/en/rss.xml",
	"dist/en/notes/rss.xml",
	"dist/en/og-image/hello-world.png",
	"dist/CNAME",
];

for (const file of requiredFiles) {
	await readFile(file);
}

const home = await readFile("dist/index.html", "utf8");
assert.match(home, /Nalansitan/);
assert.match(home, /Hello, World/);
assert.match(home, /文章/);
assert.match(home, /随笔/);
assert.match(home, /保持好奇/);
assert.match(home, /<em>持续构建。<\/em>/);
assert.match(home, /记录技术实践、阅读所得，以及那些值得反复思考的问题。/);
assert.match(home, /data-theme/);
assert.match(home, /lang="zh-CN"/);
assert.match(home, /href="\/en\/"/);
assert.match(home, /hreflang="en"/);

const article = await readFile("dist/posts/hello-world/index.html", "utf8");
assert.match(article, /我的第一篇文章/);
assert.match(article, /目录/);
assert.match(article, /href="\/en\/posts\/hello-world\/"/);
assert.match(article, /class="giscus-comments/);
assert.match(article, /className = "giscus"/);
assert.match(article, /data-repo="nalansitan\/nalansitan\.github\.io"/);
assert.match(article, /data-repo-id="R_kgDOTn8lKg"/);
assert.match(article, /data-category-id="DIC_kwDOTn8lKs4DCWud"/);
assert.match(article, /dataset\.mapping = "pathname"/);
assert.match(article, /data-lang="zh-CN"/);
assert.match(article, /theme-change/);
assert.match(article, /giscus\.dataset\.theme = event\.detail\.theme/);

const posts = await readFile("dist/posts/index.html", "utf8");
assert.match(posts, /搜索/);
assert.match(posts, /标签/);
assert.doesNotMatch(posts, /class="giscus-comments/);

const notes = await readFile("dist/notes/index.html", "utf8");
assert.doesNotMatch(notes, /data-pagefind-body/);

const note = await readFile("dist/notes/welcome/index.html", "utf8");
assert.match(note, /data-pagefind-body/);

const englishHome = await readFile("dist/en/index.html", "utf8");
assert.match(englishHome, /lang="en"/);
assert.match(englishHome, /Hi, I’m Nalansitan/);
assert.match(englishHome, /href="\/"/);
assert.match(englishHome, /hreflang="zh-CN"/);

const englishNotFound = await readFile("dist/en/404/index.html", "utf8");
assert.match(englishNotFound, /Page not found/);

const rootNotFound = await readFile("dist/404.html", "utf8");
assert.match(rootNotFound, /location\.pathname\.startsWith\("\/en\/"\)/);

const englishArticle = await readFile("dist/en/posts/hello-world/index.html", "utf8");
assert.match(englishArticle, /My First Post/);
assert.match(englishArticle, /Table of contents/);
assert.match(englishArticle, /href="\/posts\/hello-world\/"/);
assert.match(englishArticle, /class="giscus-comments/);
assert.match(englishArticle, /data-lang="en"/);

const chineseBlogTag = await readFile("dist/tags/博客/index.html", "utf8");
assert.match(chineseBlogTag, /href="\/en\/tags\/blog\/"/);

const englishBlogTag = await readFile("dist/en/tags/blog/index.html", "utf8");
assert.match(englishBlogTag, /href="\/tags\/博客\/"/);

const chineseRss = await readFile("dist/rss.xml", "utf8");
assert.doesNotMatch(chineseRss, /My First Post/);

const englishRss = await readFile("dist/en/rss.xml", "utf8");
assert.match(englishRss, /Hello, World: A New Beginning/);
assert.doesNotMatch(englishRss, /我的第一篇文章/);
assert.match(englishRss, /<link>https:\/\/blog\.nalansitan\.com\/en\/<\/link>/);

const englishNotesRss = await readFile("dist/en/notes/rss.xml", "utf8");
assert.match(englishNotesRss, /<link>https:\/\/blog\.nalansitan\.com\/en\/<\/link>/);

const sitemap = await readFile("dist/sitemap-0.xml", "utf8");
assert.match(sitemap, /\/en\/posts\/hello-world\//);
assert.doesNotMatch(sitemap, /\/404(?:\/|<)/);

const cname = (await readFile("dist/CNAME", "utf8")).trim();
assert.equal(cname, "blog.nalansitan.com");

console.log("Site verification passed.");
