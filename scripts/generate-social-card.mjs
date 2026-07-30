import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { html } from "satori-html";
import sharp from "sharp";

const fontPath = fileURLToPath(new URL("../src/assets/lxgw-wenkai-lite.ttf", import.meta.url));
const outputPath = fileURLToPath(new URL("../public/social-card.png", import.meta.url));
const font = await fs.readFile(fontPath);

const markup = html`<div style="display:flex;flex-direction:column;width:100%;height:100%;padding:72px;background:#1d1f21;color:#fff;border:14px solid #2bbc89;">
	<div style="display:flex;flex:1;flex-direction:column;justify-content:center;">
		<p style="font-size:30px;color:#c9cacc;margin:0 0 24px;">个人博客</p>
		<h1 style="font-size:88px;line-height:1.1;margin:0;">Nalansitan</h1>
		<p style="font-size:36px;color:#c9cacc;margin:28px 0 0;">记录技术、思考与生活</p>
	</div>
	<div style="display:flex;justify-content:space-between;font-size:24px;color:#c9cacc;border-top:2px solid #2bbc89;padding-top:28px;">
		<span>blog.nalansitan.com</span>
		<span>Astro Cactus</span>
	</div>
</div>`;

const svg = await satori(markup, {
	fonts: [
		{
			data: font,
			name: "LXGW WenKai Lite",
			style: "normal",
			weight: 400,
		},
		{
			data: font,
			name: "LXGW WenKai Lite",
			style: "normal",
			weight: 700,
		},
	],
	height: 630,
	width: 1200,
});

await sharp(Buffer.from(svg)).png().toFile(outputPath);
console.info(`Generated ${outputPath}`);
