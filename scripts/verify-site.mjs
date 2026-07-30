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
  "dist/posts/hello-world/index.html",
  "dist/rss.xml",
  "dist/CNAME",
];

for (const file of requiredFiles) {
  await readFile(file);
}

const home = await readFile("dist/index.html", "utf8");
assert.match(home, /Nalansitan/);
assert.match(home, /Hello, World/);

const article = await readFile("dist/posts/hello-world/index.html", "utf8");
assert.match(article, /我的第一篇文章/);

const cname = (await readFile("dist/CNAME", "utf8")).trim();
assert.equal(cname, "blog.nalansitan.com");

console.log("Site verification passed.");
