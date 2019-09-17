import { sfc2esm } from "../src/index.ts";

const jsSFC = `
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

const tsSFC = `
<template>
	<button class="btn">
    Hello {{ name }}!
  </button>
</template>

<script lang="ts">

import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator'; 

@Component({
  template: "<button>TS cache?</button>",
  props: ["name"],
})
export default class logo extends Vue {

}
</script>

<style scoped>
	.btn {
		font-size: 500%;
    background: teal;
    color: white;
    border-radius: 10px;
    border: none;
    padding: 30px;
	}
</style>`;

console.log(sfc2esm(jsSFC));
