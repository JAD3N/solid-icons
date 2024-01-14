import { Element } from "domhandler";
import { appendChild } from "domutils";

export interface IconTree {
  tag: string;
  attr: {
    [key: string]: string;
  };
  child: IconTree[];
}

export function generateIconTree(tree: IconTree): Element {
  const element = new Element(tree.tag, tree.attr);
  for (const child of tree.child) {
    appendChild(element, generateIconTree(child));
  }

  return element;
}
