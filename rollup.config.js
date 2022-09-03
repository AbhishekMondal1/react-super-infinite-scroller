import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import PeerDepsExternal from "rollup-plugin-peer-deps-external";
import dts from "rollup-plugin-dts";

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        exports: "named",
      },
      {
        file: packageJson.module,
        format: "esm",
      },
    ],
    plugins: [
      PeerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "tsconfig.json",
        exclude: ["**/__tests__/*", "**/__mocks__/*", "**/__fixtures__"],
      }),
      terser(),
    ],
  },
  {
    input: "dist/esm/index.d.ts",
    output: [
      {
        file: "dist/types/index.d.ts",
        format: "esm",
      },
    ],
    plugins: [dts()],
  },
];
