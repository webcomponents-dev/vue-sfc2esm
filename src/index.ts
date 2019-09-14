import parse from "./parser";
import {
  injectTemplateToJavaScript,
  injectTemplateToTypeScript,
  injectStylesToJavaScript
} from "./injector";

export type Compilers = (lang: string, code: string) => Promise<string>;

async function sfc2esm(sfc: string, compilers?: Compilers ): Promise<string> {
  const parts = parse(sfc);

  const code_lang = parts.script.lang;
  let code = parts.script.source;

  if (code_lang!=='js' && !compilers)
  {
    throw new Error(`You need to provide compilers to support lang=${code_lang}`);
  } 

  // Inject template pre-compilation
  //
  if (code_lang==='ts')
  {
    code = injectTemplateToTypeScript(parts.template || "", code);
  }

  // Compilation
  //
  var esm = "export default {}";

  if (compilers && code && code.length>0) {
      esm = await compilers(code_lang, code);
  }

  // Inject template post-compilation
  //
  if (code_lang!=='ts')
  {
    esm = injectTemplateToJavaScript(parts.template || "", esm);
  }

  // <style>
  //
  if (parts.styles.length > 0) {
    esm = injectStylesToJavaScript("__sfc2esm__styles", parts.styles, esm);
  }

  // <styled scoped>
  //
  if (parts.styles_scoped.length > 0) {
    esm = injectStylesToJavaScript(
      "__sfc2esm__styles_scoped",
      parts.styles_scoped,
      esm
    );
  }

  return esm;
}

export { sfc2esm };
