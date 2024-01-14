import { IconTree } from "./tree";

const componentRegex = /export function (?<component>[^(\s]+) \(props\)/;
const treeRegex = /return GenIcon\((?<tree>.+)\)\(props\);/;

const attrMap: Record<string, string> = {
  className: "class",
  htmlFor: "for",
  tabIndex: "tabindex",
  fillRule: "fill-rule",
  clipRule: "clip-rule",
  enableBackground: "enable-background",
  strokeWidth: "stroke-width",
  strokeMiterlimit: "stroke-miterlimit",
  strokeLinecap: "stroke-linecap",
  strokeLinejoin: "stroke-linejoin",
  ariaHidden: "aria-hidden",
  clipPath: "clip-path",
  strokeOpacity: "stroke-opacity",
  fillOpacity: "fill-opacity",
  stopColor: "stop-color",
};

function mapAttributes(tree: IconTree): IconTree {
  const attr: Record<string, string> = {};
  for (const [key, value] of Object.entries(tree.attr)) {
    if (key in attrMap) {
      attr[attrMap[key]] = value;
    } else {
      attr[key] = value;
    }
  }

  return {
    tag: tree.tag,
    attr,
    child: tree.child.map(mapAttributes),
  };
}

export function parseComponent(content: string): {
  component: string;
  tree: IconTree;
} {
  const component = content.match(componentRegex)?.groups?.component;
  if (!component) throw new Error("Could not parse component!");

  const json = content.match(treeRegex)?.groups?.tree;
  if (!json) throw new Error("Could not parse tree!");

  const tree = mapAttributes(JSON.parse(json));

  return { component, tree };
}
