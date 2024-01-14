import withSolid from "rollup-preset-solid";

export default withSolid([
  {
    input: "src/icons/ai/AiFillAlert.tsx",
    output: { dir: "dist/ai/" },
    targets: ["esm", "cjs"],
    writePackageJson: true,
    printInstructions: true,
  },
]);
