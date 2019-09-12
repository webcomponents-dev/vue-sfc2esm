import { sfc2esm } from '../src/index.ts';
import { Parser } from "acorn";

const fullSFC = `
<template>
	<div class="hello">
		<h1>Colored Text</h1>
		<button>{{ msg }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Push Me"
    };
  }
};
</script>

<style scoped titi=3>
.hello {
  text-align: center;
  color: #900;
}
</style>
<style>
.global {
  color: red;
}
</style>`;

describe("Full SFC Javascript", function() {
  it("should return a valid ESM", function() {
    const esm = sfc2esm(fullSFC);

    // Check valid module
    Parser.parse(esm, { sourceType: "module" });
  });
});
