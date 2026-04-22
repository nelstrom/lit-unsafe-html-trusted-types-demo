import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import {fileURLToPath} from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  // Copy built lit-html dist to _site/lit-html/
  eleventyConfig.addPassthroughCopy({
    "../../packages/lit-html/dist": "lit-html",
  });

  // Copy DOMPurify ESM build
  eleventyConfig.addPassthroughCopy({
    "node_modules/dompurify/dist/purify.es.mjs": "js/dompurify.js",
  });

  // Copy per-page demo scripts
  eleventyConfig.addPassthroughCopy("src/js");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
  };
}
