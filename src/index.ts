import parse from "@webcomponents-dev/sfc-parser";

import {
  injectTemplateToJavaScript,
  injectTemplateToTypeScript,
  injectStylesToJavaScript
} from "./injector";

export type Compilers = (lang: string, code: string) => Promise<string>;

async function sfc2esm(sfc: string, compilers?: Compilers ): Promise<string> {
  const parts = parse(sfc);

  let code;
  let code_lang;

  // Check <script>
  //
  if (parts.scripts.length > 1) {
    throw new Error("Only one <script> tag is supported");
  }
  if (parts.scripts.length == 0) {
    // Do nothing
  }
  else {
    code_lang = parts.scripts[0].attributes.lang || 'js';
    code = parts.scripts[0].content;
  }

  // Check <template>
  //
  if (parts.templates.length > 1) {
    throw new Error("Only one <template> tag is supported");
  }

  if (code && code_lang!=='js' && !compilers)
  {
    throw new Error(`You need to provide compilers to support lang=${code_lang}`);
  } 

  // Inject template pre-compilation
  //
  let templateNotInjected = true;
  if (code && code_lang==='ts' && parts.templates.length>0)
  {
    code = injectTemplateToTypeScript(parts.templates[0].content || "", code);
    templateNotInjected = false;
  }

  var esm = "export default {}";

  // Compilation
  //
  if (compilers && code && code.length>0) {
      esm = await compilers(code_lang, code);
  }

  // Inject template post-compilation
  //
  if (templateNotInjected && parts.templates.length>0) {
    esm = injectTemplateToJavaScript(parts.templates[0].content || "", esm);
  }

  const styles = parts.styles
    .filter(p => p.attributes.scoped===undefined)
    .map(p => p.content);
  const styles_scoped = parts.styles
    .filter(p => p.attributes.scoped!==undefined)
    .map(p => p.content);

  // <style>
  //
  if (styles.length > 0) {
    esm = injectStylesToJavaScript("__sfc2esm__styles", styles, esm);
  }

  // <styled scoped>
  //
  if (styles_scoped.length > 0) {
    esm = injectStylesToJavaScript(
      "__sfc2esm__styles_scoped",
      styles_scoped,
      esm
    );
  }

  return esm;
}

export { sfc2esm };
