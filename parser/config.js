const babylonConfig = {
  sourceType: "module",
  plugins: ["jsx", "objectRestSpread", "classProperties"]
};

const visitors = {
  ImportDeclaration(node, state) {
    if (
      node.source.value === "react-router" ||
      node.source.value === "react-router-native" ||
      node.source.value === "react-router-dom"
    )
      state.routerExist = true;
    state.files.push(node);
    for (let i = 0; i < node.specifiers.length; i++) {
      state.componentNames.push(node.specifiers[i].local.name);
    }
  },
  JSXIdentifier(node, state) {
    state.components.push(node);
  },
  JSXElement(node, state) {
    if (
      node.openingElement.name.name === "Route" ||
      node.openingElement.name.name === "PrivateRoute"
    )
      state.routes.push(node.openingElement.attributes);
  }
};

class Node {
  constructor(id, name, type, path, children) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.path = path;
    this.children = children;
  }
}

module.exports = {
  babylonConfig,
  visitors,
  node: Node
};
