import { porcelain } from "https://deno.land/x/libpkgx@v0.18.1/mod.ts";
const { run } = porcelain;

const mdopsContent = (file: string, script: string) =>
  `// After updating run '${script} recompile'
import { allInOne } from "https://raw.githubusercontent.com/mdops-org/mdops-cli/main/mod.ts";

if (import.meta.main) {
  allInOne({
    opsFile: "${file}",
    dependenciesSelector: 'heading[value="Dependencies"] > table',
    tasksSelector: 'heading[value="Tasks"] > heading',
  });
}
`;

const depsContent = `

## Dependencies

| dependency | version |
|------------|---------|
|            |         |
`;

const tasksContent = `

## Tasks

### recompile

\`\`\`shell
scripts/mdops recompile
\`\`\`
`;

type Options = {
  mdFile: string;
  script: string;
};

export const initScript = async ({ mdFile, script }: Options) => {
  try {
    using _ = await Deno.open(mdFile, { create: true, append: true });
    const mdContent = await Deno.readTextFile(mdFile);

    if (!mdContent.includes("# Dependencies")) {
      Deno.writeTextFile(mdFile, depsContent, { append: true });
    }

    if (!mdContent.includes("# Tasks")) {
      Deno.writeTextFile(mdFile, tasksContent, { append: true });
    }

    using __ = await Deno.open(`${script}.ts`);
    console.error(`The ${script}.ts file already exists`);
    Deno.exit();
  } catch {
    try {
      if (script.includes("/")) {
        await Deno.mkdir(script.substring(0, script.lastIndexOf("/")), {
          recursive: true,
        });
      }
    } catch {
      // empty
    } finally {
      await Deno.writeTextFile(
        `${script}.ts`,
        mdopsContent(mdFile, script),
      );

      await run(
        `deno@1.41.2 compile -A --unstable -o ${script} ${script}.ts`,
      );
    }
  }
};
