import config from "./rollup.config.base.js";

module.exports = 
  {
    ...config,
    input: "test/index.js",
    output: {
      file: "dist/test.esm.js",
      format: "es"
    }
  }
