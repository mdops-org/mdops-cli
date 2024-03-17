import { Command } from "npm:@commander-js/extra-typings";
import { parse } from "./mod.ts";
import { initScript } from "./init.ts";
import { porcelain } from "https://deno.land/x/libpkgx@v0.18.1/mod.ts";
import { listDeps } from "./dependencies.ts";
import { listTasks, runTask } from "./tasks.ts";
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

  let mdFile = opsFile;

  program.option("-f, --file <file>", "Path to markdown file", (f) => {
    mdFile = f || mdFile;
    return f;
  }, opsFile);

  program.command("parse")
    .description("Parse a markdown file to json")
    .action(async () => {
      const content = await Deno.readTextFile(mdFile);
      console.log(JSON.stringify(parse(content), null, 4));
    });

  program.command("select")
    .description("Select a subset of the markdown file using a css selector")
    .argument("<selector>", "CSS Selector to search in the file content")
    .action(async (selector) => {
      const content = await Deno.readTextFile(mdFile);
      const result = parse(content).querySelectorAll(selector);
      console.log(JSON.stringify(result, undefined, 4));
    });

  program.command("init")
    .description(
      "Initiate the current directory by creating a `scripts/mdops` binary in it",
    )
    .option("-s, --script <script>", "Path to the script", "scripts/mdops")
    .action(({ script }) => initScript({ script, mdFile }));

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
    .description("Sub-commands for managing dependencies");

  dependencies.command("list")
    .description("Print dependencies as listed in the markdown file")
    .option(
      "-s, --selector <selector>",
      "CSS selector of the dependencies table",
      dependenciesSelector,
    )
    .action(({ selector }) => listDeps({ file: mdFile, selector }));

  const tasks = program.command("tasks")
    .description("Sub-commands for managing tasks");

  tasks.command("list")
    .description("Print all the available tasks from the markdown file")
    .option(
      "-s, --selector <selector>",
      "CSS selector of the dependencies table",
      tasksSelector,
    )
    .action(({ selector }) => listTasks({ file: mdFile, selector }));

  tasks.command("run")
    .description("Run a task")
    .option(
      "-t, --tasks-selector <tasks-selector>",
      "CSS selector of the tasks",
      tasksSelector,
    )
    .option(
      "-d, --deps-selector <deps-selector>",
      "CSS selector of the dependencies table",
      dependenciesSelector,
    )
    .argument("<task>", "Name of the task to run")
    .action((task, { tasksSelector, depsSelector }) =>
      runTask(task, { depsSelector, tasksSelector, file: mdFile })
    );

  await program.parseAsync();
};
