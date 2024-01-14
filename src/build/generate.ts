import { readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import PQueue from "p-queue";
import render from "dom-serializer";
import { kebabCase } from "change-case";
import { parseComponent } from "./parse";
import { generateIconTree } from "./tree";
import { execFile } from "./util";

export async function generateIcon(
  iconPath: string,
  pkgDir: string
): Promise<{
  component: string;
  set: string;
  path: string;
}> {
  const dir = basename(dirname(iconPath));
  const file = kebabCase(basename(iconPath).slice(dir.length, -4));

  const content = await readFile(iconPath, "utf-8");
  const { component, tree } = parseComponent(content);
  const element = generateIconTree(tree);

  const innerHTML = render(element.children, {
    xmlMode: true,
  });

  const output =
    `
import { type JSX, mergeProps } from "solid-js";
import { type IconProps } from "../../lib/index";

export function ${component}(props: IconProps): JSX.Element {
  const svgAttribs = ${JSON.stringify(tree.attr)};
  const mergedProps = mergeProps(svgAttribs, props);

  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      style={{
          ...(props.style as JSX.CSSProperties | undefined),
          overflow: "visible",
          color: props.color || "currentColor",
      }}
      {...mergedProps}
      height={props.size || "1em"}
      width={props.size || "1em"}
      xmlns="http://www.w3.org/2000/svg"
    >
      ${innerHTML}
      {props.title && <title>{props.title}</title>}
    </svg>
  );
}
  `.trim() + "\n";

  const path = join(pkgDir, dir, file + ".tsx");
  await execFile("mkdir", ["-p", dirname(path)]);
  await writeFile(path, output, "utf-8");

  return { component, set: dir, path };
}

export async function generateIcons(iconPaths: string[], pkgDir: string) {
  const queue = new PQueue({ concurrency: 10 });
  const icons: Array<{
    component: string;
    set: string;
    path: string;
  }> = [];

  // generate icons
  for (const iconPath of iconPaths) {
    queue.add(async () => {
      icons.push(await generateIcon(iconPath, pkgDir));
    });
  }

  // wait for all icons to be generated
  await queue.onIdle();

  return icons;
}
