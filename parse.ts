import { fromMarkdown } from "npm:mdast-util-from-markdown";
import { gfmTable } from "npm:micromark-extension-gfm-table";
import { gfmTableFromMarkdown } from "npm:mdast-util-gfm-table";
import { normalize } from "./normalize.ts";
import { makeSelectable } from "./selectable.ts";

export const parse = (markdown: string) => {
  const mdAST = fromMarkdown(markdown, {
    extensions: [gfmTable()],
    mdastExtensions: [gfmTableFromMarkdown()],
  });

  const normalizedRoot = normalize(mdAST);

  return makeSelectable(normalizedRoot);
};
