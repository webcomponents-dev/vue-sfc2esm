import config from "./rollup.config.base.js";

module.exports = 
  {
    ...config,
    input: "src/index.ts",
    output: {
      file: "dist/index.esm.js",
      format: "es"
    }
  }
