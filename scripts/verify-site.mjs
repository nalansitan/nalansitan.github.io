import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
assert.match(packageJson.packageManager, /^pnpm@/);
assert.doesNotMatch(JSON.stringify(packageJson.scripts), /\bnpm\b/);
await access("pnpm-lock.yaml");
await assert.rejects(access("package-lock.json"));

const baseLayoutSource = await readFile("src/layouts/Base.astro", "utf8");
assert.match(baseLayoutSource, /font-sans text-base font-normal/);

const readingSurfaces = [
	"src/layouts/BlogPost.astro",
	"src/pages/about.astro",
	"src/pages/tags/[tag]/[...page].astro",
	"src/components/note/Note.astro",
];
for (const file of readingSurfaces) {
	const source = await readFile(file, "utf8");
	assert.match(source, /\bprose-reading\b/, `${file} must use the responsive reading scale`);
	assert.doesNotMatch(source, /\bprose-sm\b/, `${file} must not use the small prose scale`);
}

const workflow = await readFile(".github/workflows/deploy.yml", "utf8");
assert.match(workflow, /actions\/checkout@v6/);
assert.match(workflow, /pnpm\/action-setup@v6/);
assert.match(workflow, /actions\/setup-node@v6/);
assert.match(workflow, /actions\/upload-pages-artifact@v5/);
assert.match(workflow, /actions\/deploy-pages@v5/);
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

const baiduAnalyticsUrl = "https://hm.baidu.com/hm.js?fa757ee7b46c11522b30202a0f696ba4";
const builtHtmlFiles = (await readdir("dist", { recursive: true })).filter((file) =>
	file.endsWith(".html"),
);
assert.ok(builtHtmlFiles.length > 0);
for (const file of builtHtmlFiles) {
	const html = await readFile(`dist/${file}`, "utf8");
	assert.equal(
		html.split(baiduAnalyticsUrl).length - 1,
		1,
		`${file} must load Baidu Analytics once`,
	);
	assert.ok(
		html.indexOf(baiduAnalyticsUrl) < html.indexOf("</head>"),
		`${file} must load Baidu Analytics inside <head>`,
	);
}

const builtStylesheets = (await readdir("dist/_astro"))
	.filter((file) => file.endsWith(".css"))
	.map((file) => readFile(`dist/_astro/${file}`, "utf8"));
const builtCss = (await Promise.all(builtStylesheets)).join("\n");
assert.match(builtCss, /\.prose-reading\{font-size:1\.0625rem;line-height:1\.8/);
assert.match(
	builtCss,
	/@media \(min-width:40rem\)\{\.prose-reading\{font-size:1\.125rem/,
);

const home = await readFile("dist/index.html", "utf8");
assert.match(home, /纳兰斯坦、爱因容若/);
assert.match(home, /<title>首页 • 纳兰斯坦、爱因容若的未晚斋<\/title>/);
assert.match(home, /name="keywords"/);
assert.match(home, /content="[^"]*博客[^"]*纳兰斯坦[^"]*Nalansitan/);
assert.match(home, /content="[^"]*技术[^"]*互联网[^"]*成长[^"]*" name="keywords"/);
assert.match(
	home,
	/<meta content="纳兰斯坦（Nalansitan）与爱因容若的个人博客，记录技术实践、阅读所得，以及那些值得反复思考的问题。" name="description"/,
);
assert.match(home, /"@type":"WebSite"/);
assert.match(home, /"name":"纳兰斯坦、爱因容若的未晚斋"/);
assert.match(home, /"alternateName":"Nalansitan Blog"/);
assert.match(home, /content="首页 • 纳兰斯坦、爱因容若的未晚斋" property="og:title"/);
assert.match(home, /content="首页 • 纳兰斯坦、爱因容若的未晚斋" property="twitter:title"/);
assert.match(home, /content="纳兰斯坦、爱因容若的未晚斋" property="og:site_name"/);
assert.match(home, /Hello, World/);
assert.match(home, /文章/);
assert.match(home, /随笔/);
assert.match(home, /<span class="block">保持好奇，持续构建。<\/span>/);
assert.match(home, /<span class="block">深入思考，洞见幽微。<\/span>/);
assert.match(home, /<span class="block">以文载思，向新而行。<\/span>/);
assert.match(
	home,
	/你好，我是纳兰斯坦、爱因容若。[\s\S]*href="\/about\/"[\s\S]*>关于我<\/a>[\s\S]*保持好奇/,
);
assert.match(home, /<p class="mb-4">记录技术实践、阅读所得，以及那些值得反复思考的问题。<\/p>/);
assert.match(home, />在这里关注我<\/h2>/);
assert.doesNotMatch(home, /在这里找到我/);
assert.doesNotMatch(home, /<p class="mb-4">纳兰斯坦（Nalansitan）/);
assert.match(home, /href="https:\/\/github\.com\/nalansitan\/nalansitan\.github\.io\/issues\/new"/);
assert.match(home, />反馈与建议<\/a>/);
assert.doesNotMatch(home, /通过 Issue 联系我/);
assert.match(home, /href="https:\/\/github\.com\/nalansitan\/nalansitan\.github\.io"/);
assert.match(home, /页脚导航" class="[^"]*flex-wrap/);
assert.match(home, /src="\/images\/avatar\.jpg"/);
assert.match(home, /alt="纳兰斯坦、爱因容若的头像"/);
assert.match(home, /width="512"/);
assert.match(home, /height="512"/);
assert.match(home, /data-theme/);
assert.match(home, /lang="zh-CN"/);
assert.match(home, /href="\/en\/"/);
assert.match(home, /hreflang="en"/);

const article = await readFile("dist/posts/hello-world/index.html", "utf8");
assert.match(article, /我的第一篇文章/);
assert.match(article, /目录/);
assert.match(article, /href="\/en\/posts\/hello-world\/"/);
assert.match(article, /class="giscus-comments/);
assert.doesNotMatch(article, /giscus\.className = "giscus"/);
assert.match(article, /data-repo="nalansitan\/nalansitan\.github\.io"/);
assert.match(article, /data-repo-id="R_kgDOTn8lKg"/);
assert.match(article, /data-category-id="DIC_kwDOTn8lKs4DCWud"/);
assert.match(article, /dataset\.mapping = "pathname"/);
assert.match(article, /data-lang="zh-CN"/);
assert.match(article, /theme-change/);
assert.match(article, /giscus\.dataset\.theme = event\.detail\.theme/);
assert.doesNotMatch(article, /giscus\.dataset\.loading = "lazy"/);
assert.match(article, />评论<\/h2>/);
assert.match(article, /class="share-link/);
assert.match(article, />分享<\/button>/);
assert.match(article, /value="https:\/\/blog\.nalansitan\.com\/posts\/hello-world\/"/);
assert.match(article, />复制链接<\/button>/);

const posts = await readFile("dist/posts/index.html", "utf8");
assert.match(posts, /搜索/);
assert.match(posts, /标签/);
assert.doesNotMatch(posts, /class="giscus-comments/);
assert.doesNotMatch(posts, /class="share-link/);

const notes = await readFile("dist/notes/index.html", "utf8");
assert.doesNotMatch(notes, /data-pagefind-body/);

const note = await readFile("dist/notes/welcome/index.html", "utf8");
assert.match(note, /data-pagefind-body/);
assert.match(note, /class="giscus-comments/);
assert.match(note, /dataset\.mapping = "pathname"/);
assert.match(note, /class="share-link/);
assert.match(note, /value="https:\/\/blog\.nalansitan\.com\/notes\/welcome\/"/);

const about = await readFile("dist/about/index.html", "utf8");
assert.match(
	about,
	/href="https:\/\/github\.com\/nalansitan\/nalansitan\.github\.io\/issues\/new"/,
);
assert.match(about, />反馈与建议<\/a>/);
assert.match(about, /src="\/images\/avatar\.jpg"/);
assert.match(about, /class="share-link/);
assert.match(about, />分享<\/button>/);
assert.match(about, /value="https:\/\/blog\.nalansitan\.com\/about\/"/);
assert.match(about, />复制链接<\/button>/);
assert.match(about, />关于我<\/h1>/);
assert.match(
	about,
	/左手边，是爱因斯坦关于宇宙与未知的梦想；右手边，是纳兰容若关于文字与人间的心绪/,
);
assert.match(about, /在理性与诗意之间，顺流而下，也溯流求索。/);
assert.match(about, /我曾痴迷文学，至今仍眷恋文字背后各不相同的生命姿态/);
assert.match(about, /更是人间万千气象的回响/);
assert.match(about, /采菊东篱下，悠然见南山/);
assert.match(about, /仰天大笑出门去，我辈岂是蓬蒿人/);
assert.match(about, /一蓑烟雨任平生/);
assert.match(about, /杜甫沉郁顿挫中的悲悯/);
assert.match(about, /辛弃疾金戈铁马背后的赤诚/);
assert.match(about, /纳兰容若清丽词句里的深情/);
assert.match(about, /文学并非只是情绪的寄托/);
assert.match(about, /世界为何如此运行/);
assert.match(about, /我也曾仰望物理世界的深邃/);
assert.match(about, /牛顿用数学描述天体与尘埃/);
assert.match(about, /构成身体的元素，曾在古老恒星的内部诞生/);
assert.match(about, /循着图灵留下的思想微光，走进计算机的世界/);
assert.match(about, /文学赋予我感受世界的触角/);
assert.match(about, /最终却在我的生命里汇入同一条河流/);
assert.doesNotMatch(about, /<h2>文学<\/h2>/);
assert.doesNotMatch(about, /<h2>物理<\/h2>/);
assert.match(about, /许多今日的困惑，前人早已以不同的方式经历过。/);
assert.match(about, /科学与艺术是一体两面/);
assert.match(about, /历史让我们知道从何处来，而对人生的思考，则引导我们决定向何处去。/);
assert.match(about, /人生或许没有唯一的答案。/);
assert.match(about, /山水有程，探索无涯。/);
assert.match(about, /你好，我是纳兰斯坦、爱因容若。/);
assert.match(about, /这是我的个人博客，用来记录技术实践、阅读笔记和长期思考。/);
assert.match(about, /我相信好的写作不只是输出结论，也是在整理自己的认知。/);
assert.match(about, /网站使用 Astro Cactus、Markdown 和 pnpm 构建/);

const englishHome = await readFile("dist/en/index.html", "utf8");
assert.match(englishHome, /lang="en"/);
assert.match(englishHome, /Hi, I’m 纳兰斯坦、爱因容若/);
assert.match(englishHome, /<span class="block">Stay curious, keep building.<\/span>/);
assert.match(englishHome, /<span class="block">Think deeply, discern the subtle.<\/span>/);
assert.match(
	englishHome,
	/<span class="block">Carry thought through writing; move toward what’s new.<\/span>/,
);
assert.match(
	englishHome,
	/Hi, I’m 纳兰斯坦、爱因容若[\s\S]*href="\/en\/about\/"[\s\S]*>About Me<\/a>[\s\S]*Stay curious/,
);
assert.match(englishHome, /Nalansitan’s personal blog/);
assert.match(
	englishHome,
	/<p class="mb-4">I write about building software, reading, and ideas worth revisiting.<\/p>/,
);
assert.match(englishHome, />Feedback &amp; suggestions<\/a>/);
assert.match(englishHome, /alt="Portrait of 纳兰斯坦、爱因容若"/);
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
assert.match(englishArticle, />Comments<\/h2>/);
assert.match(englishArticle, />Share<\/button>/);
assert.match(englishArticle, />Copy link<\/button>/);

const englishNote = await readFile("dist/en/notes/welcome/index.html", "utf8");
assert.match(englishNote, /class="giscus-comments/);
assert.match(englishNote, /data-lang="en"/);
assert.match(englishNote, /class="share-link/);

const englishAbout = await readFile("dist/en/about/index.html", "utf8");
assert.match(englishAbout, />Feedback &amp; suggestions<\/a>/);
assert.match(englishAbout, /src="\/images\/avatar\.jpg"/);
assert.match(englishAbout, /class="share-link/);
assert.match(englishAbout, />Share<\/button>/);
assert.match(englishAbout, /value="https:\/\/blog\.nalansitan\.com\/en\/about\/"/);
assert.match(englishAbout, />Copy link<\/button>/);
assert.match(englishAbout, />About Me<\/h1>/);
assert.match(englishAbout, /to my left is Einstein’s dream/);
assert.match(englishAbout, /to my right, Nalan Xingde’s reflections/);
assert.match(englishAbout, /between reason and poetry/);
assert.match(englishAbout, /I was once captivated by literature/);
assert.match(englishAbout, /echoes of the human world in all its variety/);
assert.match(englishAbout, /Literature is more than a refuge for emotion/);
assert.match(englishAbout, /Tao Yuanming/);
assert.match(englishAbout, /how could one such as I be a common man/);
assert.match(englishAbout, /Su Shi/);
assert.match(englishAbout, /Du Fu/);
assert.match(englishAbout, /Xin Qiji/);
assert.match(englishAbout, /Nalan Xingde/);
assert.match(englishAbout, /Why does the world work the way it does/);
assert.match(englishAbout, /I, too, once gazed up in wonder at the depths of the physical world/);
assert.match(englishAbout, /Newton/);
assert.match(englishAbout, /The elements in our bodies were forged inside ancient stars/);
assert.match(englishAbout, /following the glimmer of thought Turing left behind/);
assert.match(englishAbout, /Literature gives me the sensitivity to feel the world/);
assert.match(englishAbout, /ultimately join the same river/);
assert.doesNotMatch(englishAbout, /<h2>Literature<\/h2>/);
assert.doesNotMatch(englishAbout, /<h2>Physics<\/h2>/);
assert.match(englishAbout, /Science and art are two sides of the same whole/);
assert.match(englishAbout, /History tells us where we came from/);
assert.match(englishAbout, /Life may not have a single answer/);
assert.match(englishAbout, /The journey has its course, but exploration knows no bounds/);
assert.match(englishAbout, /Hi, I’m Nalansitan（纳兰斯坦）\./);
assert.doesNotMatch(englishAbout, /Hi, I’m 纳兰斯坦、爱因容若\./);
assert.match(englishAbout, /This is my personal blog for software engineering/);
assert.match(englishAbout, /Good writing is more than publishing conclusions/);
assert.match(englishAbout, /The site uses Astro Cactus, Markdown, and pnpm/);

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

const manifest = JSON.parse(await readFile("dist/manifest.webmanifest", "utf8"));
assert.equal(manifest.name, "纳兰斯坦、爱因容若的未晚斋");
assert.match(manifest.description, /博客/);
assert.match(manifest.description, /纳兰斯坦/);
assert.match(manifest.description, /Nalansitan/);

console.log("Site verification passed.");
