import { Command } from "npm:@commander-js/extra-typings";
import { parse } from "./mod.ts";
import { initScript } from "./init.ts";
import { porcelain } from "https://deno.land/x/libpkgx@v0.18.1/mod.ts";
import { listDeps } from "./dependencies.ts";
const { run } = porcelain;

type Options = {
  opsFile: string;
  dependenciesSelector: string;
  tasksSelector: string;
};

export const allInOne = async (
  { opsFile, dependenciesSelector, tasksSelector }: Options,
) => {
  const program = new Command();

  program
    .name("mdops")
    .description("Markdown Driven Operasions")
    .version("0.1.0");

  program.command("parse")
    .description("Parse a markdown file to json")
    .argument("[mdFile]", "Path to markdown file", opsFile)
    .action(async (fname) => {
      const content = await Deno.readTextFile(fname);
      console.log(JSON.stringify(parse(content), null, 4));
    });

  program.command("select")
    .description("Select a subset of the markdown file using a css selector")
    .option("-f, --file <file>", "Path to markdown file", opsFile)
    .argument("<selector>", "CSS Selector to search in the file content")
    .action(async (selector, options) => {
      const content = await Deno.readTextFile(options.file);
      const result = parse(content).querySelectorAll(selector);
      console.log(JSON.stringify(result, undefined, 4));
    });

  program.command("init")
    .description(
      "Initiate the current directory by creating a `scripts/mdops` binary in it",
    )
    .option(
      "-m, --md-file <file>",
      "Path to the default markdown file",
      opsFile,
    )
    .option("-s, --script <script>", "Path to the script", "scripts/mdops")
    .action(initScript);

  program.command("recompile")
    .description("Recompile the script")
    .option(
      "-f, --file <file>",
      "Path to the script to recompile",
      "scripts/mdops.ts",
    )
    .option(
      "-o, --out <out>",
      "Path to the resulting executable",
      "scripts/mdops",
    )
    .action(async (options) => {
      await run([
        "deno@1.41.2",
        "compile",
        "-A",
        "--unstable",
        "-o",
        options.out,
        options.file,
      ]);
    });

  const dependencies = program.command("dependencies")
    .description("Sub-tasks for managing dependencies");

  dependencies.command("list")
    .description("Print dependencies as listed in the markdown file")
    .option("-f, --file <file>", "Path to markdown file", opsFile)
    .option(
      "-s, --selector <selector>",
      "CSS selector of the dependencies table",
      dependenciesSelector,
    )
    .action(listDeps);

  await program.parseAsync();
};
