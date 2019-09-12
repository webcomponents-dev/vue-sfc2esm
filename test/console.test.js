import { sfc2esm } from "../src/index.ts";

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

<style scoped>
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

console.log(sfc2esm(fullSFC));
