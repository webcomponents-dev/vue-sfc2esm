import nodeResolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
//import pkg from "./package.json";

export default {
  plugins: [
    // allow rollup to look for modules in node_modules
    nodeResolve(),
    // Compile TypeScript files
    typescript(),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs()
  ],
  //external: Object.keys(pkg.dependencies)
};

