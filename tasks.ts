import { parse } from "./parse.ts";
import { getDeps } from "./dependencies.ts";
import { porcelain } from "https://deno.land/x/libpkgx@v0.18.1/mod.ts";
const { run } = porcelain;

const getTasks = async (file: string, selector: string) => {
  const content = await Deno.readTextFile(file);
  const tasks = parse(content).querySelectorAll(selector);

  if (tasks.some((t) => t.type !== "heading")) {
    console.error(
      "Some of the selected tasks are not markdown heading. Got:",
      tasks,
    );
    Deno.exit();
  }

  const taskList = tasks.map(
    // @ts-ignore type inference doesn't work
    (task) => [task.value, task.querySelector("code").value],
  );

  return Object.fromEntries(taskList);
};

type ListOptions = {
  file: string;
  selector: string;
};

export const listTasks = async ({ file, selector }: ListOptions) => {
  const tasksMap = await getTasks(file, selector);

  console.log(tasksMap);
};

type RunOptions = {
  file: string;
  tasksSelector: string;
  depsSelector: string;
};

export const runTask = async (
  taskName: string,
  { file, tasksSelector, depsSelector }: RunOptions,
) => {
  const tasksMap = await getTasks(file, tasksSelector);

  if (!(taskName in tasksMap)) {
    console.log(
      "Requested task was not found",
      taskName,
      Object.keys(tasksMap),
    );
    Deno.exit();
  }

  const task = `#!/usr/bin/env bash\n\n${tasksMap[taskName]}`;
  const deps = await getDeps(file, depsSelector);

  const fileName = await Deno.makeTempFile();
  try {
    await Deno.writeTextFile(fileName, task);

    const depsStr = deps.map(([dep, ver]) => `+${dep}@${ver}`).join(' ')
    await run(`pkgx ${depsStr} ${fileName}`);
  } finally {
    await Deno.remove(fileName);
  }
};
