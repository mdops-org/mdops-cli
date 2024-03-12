import { porcelain } from "https://deno.land/x/libpkgx@v0.18.1/mod.ts";
const { run } = porcelain;

const mdopsContent = (file: string, script: string, local: boolean) =>
  `// After updating run '${script} recompile'
import { allInOne } from "${
    local ? `${"../".repeat(script.split("/").length-1)}./mod.ts` : "jsr:@mdops/lib"
  }";

if (import.meta.main) {
  allInOne({
    opsFile: "${file}",
    dependenciesSelector: 'heading[value="Dependencies"] > table',
    tasksSelector: 'heading[value="Tasks"]',
  });
}
`;

type Options = {
  mdFile: string;
  script: string;
};

export const initScript = async ({ mdFile, script }: Options) => {
  try {
      Deno.open(mdFile, {create: true})
    using _ = await Deno.open(`${script}.ts`);
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
        mdopsContent(mdFile, script, Deno.env.get("BUILD") !== "production"),
      );

      await run(
        `deno@1.41.2 compile -A --unstable -o ${script} ${script}.ts`,
      );
    }
  }
};
