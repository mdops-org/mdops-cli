import { Nodes } from "npm:@types/mdast";
import { select, selectAll } from "npm:unist-util-select";

export type Selectable = Nodes & {
  querySelector(selector: string): Selectable | undefined;
  querySelectorAll(selector: string): Selectable[];
};

export const makeSelectable = (root: Nodes): Selectable => {
  return {
    ...root,
    querySelector: (selector: string) => {
      const res = select(selector, root) as Nodes | undefined;
      return res ? makeSelectable(res) : undefined;
    },
    querySelectorAll: (selector: string) => {
      const res = selectAll(selector, root) as Nodes[];
      return res.map(makeSelectable);
    },
  };
};
