const createCompNodes = (filesToParse, state, nodes, parent, visited) => {
  return filesToParse
    .map(path => {
      let name = path.match(/(\w*).\w{1,3}$/)[1];
      if (state.componentNames.includes(name)) {
        if (!nodes[name]) {
          nodes[name] = new Node(name, name, "component", path, []);
        }
        nodes[parent].children.push(name);
        if (!visited.includes(path)) {
          return { path, name };
        }
      }
      return;
    })
    .filter(el => el);
};

module.exports = createCompNodes;
