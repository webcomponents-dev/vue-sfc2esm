import parse from "./parser";
import {
  injectTemplateToJavaScript,
  injectStylesToJavaScript
} from "./injector";

type Compilers = (lang: string, code: string) => Promise<string>;

async function sfc2esm(sfc: string, compilers?: Compilers ): Promise<string> {
  const parts = parse(sfc);

  const code = parts.script.source;
  var esm = "export default {}";

  if (compilers && code && code.length>0) {
      esm = await compilers(parts.script.lang, code);
  }

  esm = injectTemplateToJavaScript(parts.template || "", esm);

  if (parts.styles.length > 0) {
    esm = injectStylesToJavaScript("__sfc2esm__styles", parts.styles, esm);
  }

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
