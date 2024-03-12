import { Heading, Parent, Root } from "npm:@types/mdast";
import { SKIP, visitParents } from "npm:unist-util-visit-parents";

const copyNodeWithoutChildren = <T extends Parent>(node: T): T => {
  const result = { ...node };
  result["children"] = [];
  delete result['position'];
  return result;
};

export const normalize = (root: Root): Root => {
  const result = copyNodeWithoutChildren(root);
  const stack: Heading[] = [];

  visitParents(root, (node) => {
    if (node.type === "root") return true;

    const copy = copyNodeWithoutChildren(node as any);

    if (node.type === "heading") {
      if (node.children[0].type === "text") {
        copy.value = node.children[0].value;
      }

      while (stack.length > 0 && stack.at(-1)!.depth >= node.depth) {
        stack.pop();
      }

      if (stack.length === 0) {
        result.children.push(copy);
      } else {
        stack.at(-1)!.children.push(copy);
      }

      stack.push(copy);
      return SKIP;
    }

    if (stack.length === 0) {
      result.children.push(copy);
      return SKIP;
    }

    stack.at(-1)!.children.push(copy);
    return SKIP;
  });

  return result;
};
