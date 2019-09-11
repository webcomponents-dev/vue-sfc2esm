import parse from "./parser";
import { injectTemplateToJavaScript } from "./templateInjectors";

interface SFC2ESM_Result {
  script : string;
  style_scoped ?: string; 
  style ?: string;
}

function sfc2esm(sfc: string) : SFC2ESM_Result {

  const parts = parse(sfc);

  if (parts.script.lang!=='javascript')
  {
    throw new Error("Only Javascript is currently supported");
  }

  const esm = injectTemplateToJavaScript(parts.template, parts.script.source);

  return { script: esm };
}

export { sfc2esm };
