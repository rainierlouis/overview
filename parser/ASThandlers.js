const babylonConfig = {
  sourceType: "module",
  plugins: ["jsx", "objectRestSpread", "classProperties"]
};

const visitors = {
  ImportDeclaration(node, state) {
    if (
      node.source.value !== "react-router" &&
      node.source.value !== "react-router-native" &&
      node.source.value !== "react-router-dom" &&
      node.source.value !== "react-redux" &&
      node.source.value !== "react"
    ) {
      let importObj = {
        path: node.source.value,
        names: node.specifiers.map(spec => spec.local.name)
      };
      state.imports.push(importObj);
    }
  },
  JSXIdentifier(node, state) {
    if (node.name !== "store") state.identifiers.push(node.name);
  },
  JSXElement(node, state) {
    if (
      node.openingElement.name.name === "Route" ||
      node.openingElement.name.name === "PrivateRoute"
    ) {
      let attr = node.openingElement.attributes;
      for (var i = 0; i < attr.length; i++) {
        if (
          attr[i].value &&
          attr[i].value.type === "JSXExpressionContainer" &&
          attr[i].value.expression.name
        ) {
          state.identifiers.push(attr[i].value.expression.name);
        }
      }
    }
  }
};

async function walker(ast, visitors) {
  const state = {
    identifiers: [],
    imports: []
  };
  walk.simple(ast, visitors, state);
  return state;
}

module.exports = {
  babylonConfig,
  visitors,
  node: Node,
  walker
};
