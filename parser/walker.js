async function walker(ast, visitors) {
  const state = {
    files: [],
    routes: [],
    components: [],
    componentNames: [],
    routerExist: false
  };
  walk.simple(ast, visitors, state);
  return state;
}

module.exports = walker;
