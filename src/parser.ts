const domParser = new DOMParser();

interface ParserResult {
  template?: string;
  script: { lang: string, source?: string }
  styles: string[];
  styles_scoped: string[];
}

function parse(sfc: string) : ParserResult {
  
  var result: ParserResult = { 
    template: undefined,
    script: { lang: 'javascript', source: undefined },
    styles: [],
    styles_scoped: []
  };

  var doc = domParser.parseFromString(sfc, "text/html");

  // Get templates
  let templates = doc.getElementsByTagName("template");
  if (templates && templates.length > 0) {
    if (templates.length > 1) {
      throw new Error("Only one <template> tag is allowed.");
    }
    result.template = templates[0].innerHTML.trim();
  }

  // Get script
  let scripts = doc.getElementsByTagName("script");
  if (scripts && scripts.length > 0) {
    
    if (scripts.length > 1) {
      throw new Error("Only one <script> tag is currently supported.");
    }

    let s = scripts[0];
    result.script.source = s.innerHTML.trim();

    // Get lang
    const lang = s.getAttribute("lang");
    if (lang) {
      result.script.lang = lang;
    }
  }

  // Get script
  let styles = doc.getElementsByTagName("style");
  if (styles && styles.length > 0) {
    for(let i=0; i<styles.length; i++) {
      const s = styles[i];
      const css = s.innerHTML.trim();
      if (s.hasAttribute('scoped')) {
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
