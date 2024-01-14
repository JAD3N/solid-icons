interface Context {
  component: string;
  attribs: Record<string, string>;
  innerHTML: string;
}

function moduleTemplate(ctx: Context) {
  return `
import { type JSX, mergeProps } from "solid-js";
import { type IconProps } from "../lib/index";

export function ${ctx.component}(props: IconProps): JSX.Element {
  const svgAttribs = ${JSON.stringify(ctx.attribs)};
  const mergedProps = mergeProps(svgAttribs, props);

  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      {...mergedProps}
    >
      ${ctx.innerHTML}
    </svg>
  );
}
  `;
  return (
    [
      `export function ${ctx.component}(props) {`,
      `  const svgAttribs = ${JSON.stringify(ctx.attribs)};`,
      `  const mergedProps = mergeProps(svgAttribs, props);`,
      `  return <svg stroke="currentColor" fill="currentColor" stroke-width="0" `,
    ].join("\n") + "\n"
  );
}

function typesTemplate(ctx: Context) {
  return `
import { type JSX } from "solid-js";
import { type IconProps } from "../lib/index";

export declare function ${ctx.component}(props: IconProps): JSX.Element;
  `.trim() + "\n";
}

export const templates = [
  {
    template: moduleTemplate,
    extension: ".jsx",
  },
  {
    template: typesTemplate,
    extension: ".d.ts",
  },
];
