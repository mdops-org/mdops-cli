import { TableRow, Text } from "npm:@types/mdast";
import { parse } from "./parse.ts";
import { Selectable } from "./selectable.ts";

export const getDeps = async (file: string, selector: string) => {
  const content = await Deno.readTextFile(file);
  const table = parse(content).querySelector(selector);

  if (table?.type !== "table") {
    console.error(
      `The selected content with selector '${selector}' is not a table:`,
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

  return rows.map((row) =>
    row.querySelectorAll("tableCell text").map((text) => (text as Text).value)
  );
};

type Options = {
  file: string;
  selector: string;
};

export const listDeps = async (options: Options) => {
  const deps = await getDeps(options.file, options.selector);

  console.log(deps.map((d) => d.join(" :: ")).join("\n"));
};
