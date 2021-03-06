class Node {
  constructor(id, name, type, path, children) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.path = path;
    this.children = children;
  }
}

const createNodes = (state, validNodes, nodes, parent) => {
  let importNames = state.imports.reduce((acc, el) => {
    return [...acc, ...el.names];
  }, []);
  importNames.forEach(name => {
    if (!nodes[name] && validNodes.includes(name)) {
      nodes[name] = new Node(name, name, "component", null, []);
      if (!nodes[parent].children.includes(name))
        nodes[parent].children.push(name);
    }
  });
};

const checkNodeValidity = (state, validNodes) => {
  let res = [];
  state.imports.forEach(el => {
    for (let i = 0; i < el.names.length; i++) {
      if (
        state.identifiers.includes(el.names[i]) &&
        !validNodes.includes(el.names[i])
      )
        res.push(el.names[i]);
    }
  });
  return res;
};

const createFileList = (filesToParse, validNodes, visited) => {
  return filesToParse
    .map(obj => {
      for (let i = 0; i < obj.input.names.length; i++) {
        if (
          validNodes.includes(obj.input.names[i]) &&
          !visited.includes(obj.result)
        ) {
          return { name: obj.input.names[i], path: obj.result };
        }
      }
    })
    .filter(el => el);
};

module.exports = {
  createNodes,
  node: Node,
  checkNodeValidity,
  createFileList
};
