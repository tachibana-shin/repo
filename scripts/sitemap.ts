import { SitemapStream, streamToPromise } from "sitemap";
import fg from "fast-glob";
import matter from "gray-matter";
import fs from "fs-extra";
import MarkdownIt from "markdown-it";
import { JSDOM } from "jsdom";
import dayjs from "dayjs";
import path from "path";

const markdown = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

const DOMAIN = "https://shin.is-a.dev/repo";

// sitemap.write({ url: "/page-1/", changefreq: "daily", priority: 0.3 });
// sitemap.write("/page-2");

async function scanPages() {
  const files = await fg("pages/**/*.md");

  const posts: any[] = (
    await Promise.all(
      files
        .filter((i) => {
          return path.basename(i).startsWith("[...") === false;
        })
        .map(async (i) => {
          const raw = await fs.readFile(i, "utf-8");
          const { data, content } = matter(raw);

          const html = markdown
            .render(content)
            .replace('src="/', `src="${DOMAIN}/`);
          const dom = new JSDOM(html).window.document;

          if (data.image?.startsWith("/")) {
            data.image = DOMAIN + data.image;
          }

          return {
            lastmod: data.date,
            changefreq: "weekly",
            url:
              DOMAIN + i.replace(/^pages(.+)\.md$/, "$1").replace(/index$/, ""),
            image: [
              ...(data.image
                ? [
                    {
                      url: data.image,
                      title: data.title,
                      license: "https://creativecommons.org/licenses/by/4.0/",
                    },
                  ]
                : []),
              ...Array.from(dom.querySelectorAll<HTMLImageElement>("img")).map(
                (img) => {
                  return {
                    url: img.getAttribute("src"),
                    title: data.title,
                    caption: data.getAttribute("caption"),
                    license: "https://creativecommons.org/licenses/by/4.0/",
                  };
                }
              ),
            ],
            video: Array.from(
              dom.querySelectorAll<HTMLVideoElement>("video")
            ).map((video) => {
              return {
                thumbnail_loc: video.getAttribute("thumbnail"),
                title: data.title,
                description: video.getAttribute("description"),
              };
            }),
            news: i.startsWith("pages/posts/") && {
              publication: {
                name: data.title,
                language: data.lang === "auto" ? void 0 : (data.lang ?? "en"),
              },
              genres: "Blog",
              publication_date: dayjs(data.date).format("YYYY-MM-DD"),
              title: data.title,
            },
          };
        })
    )
  ).filter(Boolean);

  posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return posts;
}

async function main() {
  const sitemap = new SitemapStream({
    hostname: DOMAIN,
    xmlns: {
      // trim the xml namespace
      news: true, // flip to false to omit the xml namespace for news
      xhtml: true,
      image: true,
      video: true,
    },
  });

  (await scanPages()).forEach((page) => {
    sitemap.write(page);
  });

  sitemap.end();

  streamToPromise(sitemap).then((sm) => {
    fs.writeFile("./dist/sitemap.xml", sm.toString());
  });
}

void main();