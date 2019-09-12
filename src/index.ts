import parse from "./parser";
import { injectToJavaScript, injectStylesToJavaScript } from "./injector";

function sfc2esm(sfc: string): string {
  const parts = parse(sfc);

  if (parts.script.lang !== "javascript") {
    throw new Error("Only Javascript is currently supported");
  }

  let esm = parts.script.source || "export default {}";
  esm = injectToJavaScript(parts.template || "", esm);

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
