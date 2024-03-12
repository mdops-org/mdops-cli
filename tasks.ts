import { parse } from "./parse.ts";

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

type Options = {
  file: string;
  selector: string;
};

export const listTasks = async ({ file, selector }: Options) => {
  const tasksMap = await getTasks(file, selector);

  console.log(tasksMap);
};
