import { Heading, Nodes, Root } from "npm:@types/mdast";
import { SKIP, visitParents } from "npm:unist-util-visit-parents";

type AddValueToHeading<T extends Nodes> = T extends Heading
  ? Heading & { value: string }
  : T;

const copyNodeWithoutChildren = <T extends Nodes>(
  node: T,
): AddValueToHeading<T> => {
  const result = { ...node };

  if ("children" in result) {
    result["children"] = [];

    if (node.type === "heading" && node.children[0]?.type === "text") {
      // @ts-ignore tyepscript doesn't understand that result is of type heading here
      result.value = node.children[0].value;
    }
  }

  if ("position" in result) {
    delete result["position"];
  }

  // @ts-ignore it can't infer type of result properly
  return result;
};

const copyRecursive = <T extends Nodes>(node: T): AddValueToHeading<T> => {
  const result = copyNodeWithoutChildren(node);

  if (node.type !== "heading" && "children" in node) {
    for (const child of node["children"]) {
      // @ts-ignore typescript doesn't understand result has children because node has
      result.children.push(copyRecursive(child));
    }
  }

  return result;
};

export const normalize = (root: Root): Root => {
  const result = copyNodeWithoutChildren(root);
  const stack: Heading[] = [];

  visitParents(root, (node) => {
    if (node.type === "root") return true;

    const copy = copyRecursive(node);

    if (node.type === "heading") {
      while (stack.length > 0 && stack.at(-1)!.depth >= node.depth) {
        stack.pop();
      }

      if (stack.length === 0) {
        result.children.push(copy);
      } else {
        // @ts-ignore It doesn't infer type of copy correctly
        stack.at(-1)!.children.push(copy);
      }

      // @ts-ignore It doesn't infer type of copy correctly
      stack.push(copy);
      return SKIP;
    }

    if (stack.length === 0) {
      result.children.push(copy);
      return SKIP;
    }

    // @ts-ignore It doesn't infer type of copy correctly
    stack.at(-1)!.children.push(copy);
    return SKIP;
  });

  return result;
};
