import { parse as parser, HTMLElement } from "node-html-parser";

interface ParserResult {
  template?: string;
  script: { lang: string, source?: string }
  styles: string[];
  styles_scoped: string[];
}

function parse(sfc: string) : ParserResult {
  
  var result: ParserResult = { 
    template: undefined,
    script: { lang: 'js', source: undefined },
    styles: [],
    styles_scoped: []
  };

  var doc = parser(sfc, {
    lowerCaseTagName: true,
    script: true, // retrieve content in <script> (hurt performance slightly)
    style: true, // retrieve content in <style> (hurt performance slightly)
    pre: true // retrieve content in <pre> (hurt performance slightly)
  }) as HTMLElement;

  // Get templates
  let templates = doc.querySelectorAll("template");
  if (templates && templates.length > 0) {
    if (templates.length > 1) {
      throw new Error("Only one <template> tag is allowed.");
    }
    result.template = templates[0].innerHTML.trim();
  }

  // Get script
  let scripts = doc.querySelectorAll("script");
  if (scripts && scripts.length > 0) {
    
    if (scripts.length > 1) {
      throw new Error("Only one <script> tag is currently supported.");
    }

    let s = scripts[0];
    result.script.source = s.innerHTML.trim();

    // Get lang
    const lang = s.attributes.lang;
    if (lang) {
      result.script.lang = lang;
    }
  }

  // Get script
  let styles = doc.querySelectorAll("style");
  if (styles && styles.length > 0) {
    for(let i=0; i<styles.length; i++) {
      const s = styles[i];
      const css = s.innerHTML.trim();
      if (s.attributes.scoped!==undefined) {
        result.styles_scoped.push(css);
      }
      else {
        result.styles.push(css);
      }
    }
  }

  return result;
}

export default parse;
