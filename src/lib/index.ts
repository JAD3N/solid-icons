import type { JSX } from "solid-js";

export type IconProps = JSX.SVGElementTags["svg"] & {
  size?: string | number;
  color?: string;
  title?: string;
  styles?: JSX.CSSProperties;
};
