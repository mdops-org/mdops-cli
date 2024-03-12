import { Nodes } from "npm:@types/mdast";
import { visitParents } from "npm:unist-util-visit-parents";

const nodeToStr = (node: Nodes) => {
  const props = Object.entries(node)
    .filter(([k]) => !["type", "children", "position"].includes(k))
    .map(([k, v]): string => `${k}: ${JSON.stringify(v)}`)
    .join(", ");
  return node.type + (props ? ` { ${props} }` : " {}");
};

const nodeWithChildrenToStr = (node: Nodes) => {
  const result: string[] = [];

  visitParents(node, (node, ancesstors): void => {
    const prefix = "".padStart(ancesstors.length * 4, " ");
    result.push([prefix, nodeToStr(node)].join(""));
  });

  return result.join("\n");
};

export const print = (nodes: Nodes) => {
  console.log(nodeWithChildrenToStr(nodes));
};
