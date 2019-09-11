import {sfc2esm} from '../src/index.ts';

const basicSFC = `
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

const result = sfc2esm(basicSFC);

console.log(result);
