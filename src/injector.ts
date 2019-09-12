import { Parser, Node } from "acorn";
import { walk } from "estree-walker";
import MagicString from "magic-string";

function escape(s: string) : string {
  return s.replace(/["'\\\n\r\u2028\u2029]/g, function (character) : string {
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

    // Should not append
    return character;
  })
}

function concatStyles( array: string[] ) : string {
  return array.reduce((r, css) => (r = r.concat('\n', css)));  
}

function buildProps(template: string, styles: string[], styles_scoped: string[]) {
  let props: string[] = [];

  // Add template
  props.push(`template: "${escape(template)}"`);

  // Add global styles
  if (styles.length>0)
  {
    props.push(`"__sfc2esm__style": "${escape(concatStyles(styles))}"`);
  }

  // Add scoped styles
  if (styles_scoped.length > 0) {
    props.push(`"__sfc2esm__style_scoped": "${escape(concatStyles(styles_scoped))}"`);
  }

  return props.join(',\n');
}

function injectToJSON(object: any, template: string, styles: string[], styles_scoped: string[], ms: MagicString) {

  const propsString = buildProps(template, styles, styles_scoped);

  if (object.properties && object.properties.length > 0) {
    // If there is properties
    ms.appendLeft(
      object.properties[0].start,
      `${propsString},\n`
    );
  } // No properties
  else {
    ms.overwrite(object.start, object.end, `{ ${propsString} }`);
  }
}

function injectToJavaScript(
  template: string,
  styles: string[],
  styles_scoped: string[],
  source: string
): string {
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
        injectToJSON(object, template, styles, styles_scoped, ms);
        injected++;
      }
      // export const myComponent = { ... }
      else if (node.type === "ExportNamedDeclaration") {
        const object = node.declaration.declarations[0].init;
        injectToJSON(object, template, styles, styles_scoped, ms);
        injected++;
        const variable_start = node.declaration.start;
        const variable_end = object.start;
        ms.overwrite(variable_start, variable_end, "default "); // Transform to export default
      }
    }
  });

  if (injected < 1 || injected > 1) {
    throw new Error(
      "Fail to parse the Vue SFC <script> tag - Please report an issue with your SFC"
    );
  }

  return ms.toString();
}

export { injectToJavaScript };
