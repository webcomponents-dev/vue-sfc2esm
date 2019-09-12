import parse from "./parser";
import { injectToJavaScript } from "./injector";

function sfc2esm(sfc: string) : string {

  const parts = parse(sfc);

  if (parts.script.lang!=='javascript')
  {
    throw new Error("Only Javascript is currently supported");
  }

  let esm = parts.script.source || 'export default {}';
  esm = injectToJavaScript(parts.template || '', parts.styles, parts.styles_scoped, esm);

  return esm;
}

export { sfc2esm };
