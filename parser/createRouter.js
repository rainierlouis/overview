const createRouter = (state, nodes, parent) => {
  if (state.routerExist && state.routes.length && state.routes.length > 1) {
    if (!nodes.router) {
      nodes["router"] = new Node("router", "Router", "router", null, []);
    }
    nodes[parent].children.push("router");

    state.routes.forEach(route => {
      for (let i = 0; i < route.length; i++) {
        if (
          route[i].value &&
          route[i].value.expression &&
          state.componentNames.includes(route[i].value.expression.name)
        ) {
          let name = route[i].value.expression.name;
          if (!nodes[name]) {
            nodes[name] = new Node(name, name, "component", null, []);
          }
          nodes.router.children.push(name);
          break;
        }
      }
    });
  }
};

module.exports = createRouter;
