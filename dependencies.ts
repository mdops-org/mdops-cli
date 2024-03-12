import { TableRow, Text } from "npm:@types/mdast";
import { parse } from "./parse.ts";
import { Selectable } from "./selectable.ts";

type Options = {
    file: string;
    selector: string;
}

export const listDeps = async (options: Options) => {
  const content = await Deno.readTextFile(options.file);
  const table = parse(content).querySelector(options.selector);

  if (table?.type !== "table") {
    console.error(
      "The selected content with selector '${options.selector}' is not a table:",
      table,
    );
    Deno.exit();
  }

  const [header, ...rows] = table.querySelectorAll(
    "tableRow",
  ) as (TableRow & Selectable)[];

  if (header.children.length !== 2) {
    console.error(
      "Table format is not correct. Need two columns 'dependency' and 'version'. Got:",
      header,
    );
    Deno.exit();
  }

  const columns = header.querySelectorAll("tableCell text").map((text) =>
    (text as Text).value
  );

  if (columns.join() !== "dependency,version") {
    console.error(
      "Table format is not correct. Need two columns 'dependency' and 'version'. Got:",
      columns,
    );
    Deno.exit();
  }

  const deps = rows.map((row) =>
    row.querySelectorAll("tableCell text").map((text) => (text as Text).value)
  );

  console.log(deps.map((d) => d.join(" :: ")).join("\n"));
};
