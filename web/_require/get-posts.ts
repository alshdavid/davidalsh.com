import * as node_path from "node:path";
import * as node_fs from "node:fs";
import { renderMarkdownFile } from "./render-markdown";
import { parseYamlFromFile } from "./parse-yaml";
import { IContext } from "./context";

export function getPosts(context: IContext) {
  const path_input_dir_abs_posts = node_path.join(__dirname, "..", "..", "posts")
  const ls = node_fs.readdirSync(path_input_dir_abs_posts);
  const posts = [];
  const all_tags = new Set();

  const HeadingsWithProps = new RegExp("<h[1-6][^>].*?</h[1-6]>", "g");
  const HeadingsWithoutProps = new RegExp("<h[1-6]>.*?</h[1-6]>", "g");
  const PreTags = new RegExp("<pre>.*?</pre>", "g");
  const PreTagsWithProps = new RegExp("<pre[^>].*?</pre>", "g");
  const CodeTags = new RegExp("<code>.*?</code>", "g");
  const CodeTagsWithPros = new RegExp("<code[^>].*?</code>", "g");
  const SpecialCharacters = new RegExp("&.*?;", "g");
  const Sanitize = new RegExp("(<([^>]+)>)", "g");

  for (const itemName of ls) {
    const itemPathAbs = node_path.join(path_input_dir_abs_posts, itemName);
    const path_file_abs_meta = node_path.join(itemPathAbs, "meta.yaml")
    const path_file_abs_readme = node_path.join(itemPathAbs, "readme.md")

    const meta = parseYamlFromFile(context, path_file_abs_meta);
    const readme = renderMarkdownFile(context, path_file_abs_readme, {
      renderHighlighting: false,
    });

    const preview = readme
        .replaceAll(HeadingsWithProps, "")
        .replaceAll(HeadingsWithoutProps, "")
        .replaceAll(PreTagsWithProps, "")
        .replaceAll(PreTags, "")
        .replaceAll(CodeTagsWithPros, "")
        .replaceAll(CodeTags, "")
        .replaceAll(Sanitize, "")
        .replaceAll(SpecialCharacters, "")
        .replaceAll("\n", " ")
        .replaceAll("\t", "")
        .replaceAll("\r", "")
        .substring(0, 500);

    posts.push({
      preview,
      ...meta,
    });

    for (const tag of meta.tags) all_tags.add(tag);
  }

  posts.sort((a, b) => (new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()));

  return {
    all_tags: Array.from(all_tags),
    posts,
  };
}
