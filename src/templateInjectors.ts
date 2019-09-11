import { Parser, Node } from "acorn";
import { walk } from "estree-walker";
import MagicString from "magic-string";

function escape(s: string) : string {
  return s.replace(/["'\\\n\r\u2028\u2029]/g, function (character) {
    // Escape all characters not included in SingleStringCharacters and
    // DoubleStringCharacters on
    // http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
    switch (character) {
      case '"':
      case "'":
      case '\\':
        return '\\' + character
      // Four possible LineTerminator characters need to be escaped:
      case '\n':
        return '\\n'
      case '\r':
        return '\\r'
      case '\u2028':
        return '\\u2028'
      case '\u2029':
        return '\\u2029'
    }
  })
}

function injectToJSON(object, template: string, ms: MagicString) {

  const escapedTemplate = escape(template);

  if (object.properties && object.properties.length > 0) {
    // If there is properties
    ms.appendLeft(
      object.properties[0].start,
      `template: "${escapedTemplate}",\n`
    );
  } // No properties
  else {
    ms.overwrite(
      object.start,
      object.end,
      `{ template: "${escapedTemplate}" }`
    );
  }
}

function injectTemplateToJavaScript(template: string, source: string): string {

  // If empty script return a quick result
  if(!source || source.trim().length===0) {
    return `export default { template: "${escape(template)}" }`;
  }

  // Let's parse the source code
  const ast = Parser.parse(source, { sourceType: "module" });
  const ms = new MagicString(source);

  let injected = 0;

  walk(ast, {
    enter: function(node, parent, prop, index) {
      // export default { ... }
      if (
        node.type === "ExportDefaultDeclaration" &&
        node.declaration.type === "ObjectExpression"
      ) {
        const object = node.declaration;
        injectToJSON(object, template, ms);
        injected++;
      }
      // export const myComponent = { ... }
      else if (node.type === "ExportNamedDeclaration") {
        const object = node.declaration.declarations[0].init;
        injectToJSON(object, template, ms);
        injected++;
        const variable_start = node.declaration.start;
        const variable_end = object.start;
        ms.overwrite(variable_start, variable_end, "default "); // Transform to export default
      }
    },
  });

  if (injected < 1 || injected > 1)
  {
    throw new Error(
      "Fail to parse the Vue SFC <script> tag - Please report an issue with your SFC"
    ); 
  }

  return ms.toString();
}

export { injectTemplateToJavaScript };
