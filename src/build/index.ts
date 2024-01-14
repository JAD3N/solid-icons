import { join } from "node:path";
import { glob } from "glob";
import PQueue from "p-queue";
import { build as viteBuild } from "vite";
import solidPlugin from "vite-plugin-solid";
import { execFile, getDistDir, getIconsDir, getPackageDir } from "./util";
import { generateIcons } from "./generate";

async function fetch() {
  const version = "5.0.1";
  const url = `https://github.com/react-icons/react-icons/releases/download/v${version}/react-icons-all-files-${version}.tgz`;

  const iconsDir = getIconsDir();

  console.log("Cleaning up icons directory...");
  // clean up and create icons directory
  await execFile("rm", ["-rf", iconsDir]);
  await execFile("mkdir", [iconsDir]);

  // download and extract icons
  console.log("Downloading react-icons...");
  await execFile("curl", ["-L", url, "-o", "react-icons.tgz"], {
    cwd: iconsDir,
  });

  console.log("Extracting react-icons...");
  await execFile("tar", ["-xzf", "react-icons.tgz", "--strip-components=1"], {
    cwd: iconsDir,
  });

  console.log("Cleaning up archive...");
  await execFile("rm", ["react-icons.tgz"], { cwd: iconsDir });
}

async function build() {
  const pkgDir = getPackageDir();

  console.log("Cleaning up package directory...");
  // clean up and create icons directory
  await execFile("rm", ["-rf", pkgDir]);
  await execFile("mkdir", [pkgDir]);

  console.log("Finding icons...");
  const iconsDir = getIconsDir();
  const iconPaths = await glob("**/*.mjs", {
    cwd: iconsDir,
    ignore: [
      "lib/**/*",
      "index.mjs",
      "index.d.ts",
      "index.js",
      "index.d.ts",
      "index.js",
    ],
  });

  console.log("Generating icons...");
  const icons = await generateIcons(
    iconPaths.map((path) => join(iconsDir, path)),
    pkgDir
  );

  console.log("Building icons...");
  const distDir = getDistDir();
  await buildIcons(icons, distDir);
}

async function buildIcons(
  icons: Array<{
    component: string;
    set: string;
    path: string;
  }>,
  distDir: string
) {
  let optionsArr = withSolid(
    icons
      .slice(0, 1)
      .map((icon) => ({
        input: icon.path,
        output: { dir: join(distDir, icon.set) },
        external: ["solid-js"],
      }) as RollupOptions)
  );

  if (!Array.isArray(optionsArr)) {
    optionsArr = [optionsArr];
  }

  const queue = new PQueue({ concurrency: 10 });
  for (const options of optionsArr) {
    queue.add(() => rollup(options));
  }
}

async function main() {
  await fetch();
  await build();

  console.log("Done!");
}

await main().catch((err) => {
  console.error(err);
  process.exit(1);
});
