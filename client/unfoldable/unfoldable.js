const mountTree = () => {
  let tree = prepareData(data);
  let margin = { top: 20, right: 90, bottom: 30, left: 90 },
    width = $("#graph").innerWidth() - margin.left - margin.right,
    height = $("#graph").innerHeight() - margin.top - margin.bottom;

  svg = d3v4
    .select("#graph")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  treemap = d3v4.tree().size([height, width]);

  const root = d3v4.hierarchy(tree, function(d) {
    return d.children;
  });
  root.x0 = height / 2;
  root.y0 = 0;

  unfoldToLevel(root, 3);
  update(root, root);
};

const prepareData = data => {
  const processed = [];

  const transChildren = (id, depth = 0) => {
    processed.push(id);
    return Object.assign({}, data[id], {
      depth,
      children: data[id].children.map(childID => {
        if (processed.includes(childID))
          return Object.assign({}, data[childID], {
            children: []
          });
        return transChildren(childID, depth + 1);
      })
    });
  };
  return transChildren("root");
};

const unmountTree = () => {
  delete root, treemap, svg;
};

const traverse = (node, func) => {
  if (func(node)) node.children.forEach(node => traverse(node, func));
};

const unfoldToLevel = (root, toLevel) => {
  traverse(root, node => {
    if (node.depth <= toLevel && node.children) {
      return true;
    } else {
      collapse(node);
      return false;
    }
  });
};

const collapse = node => {
  if (node.children) node.children.forEach(collapse);
};

const update = (source, root) => {
  let i = 0;
  let duration = 500;

  // Assigns the x and y position for the nodes
  let tree = treemap(root);

  // Compute the new tree layout
  let nodes = tree.descendants();
  let links = tree.descendants().slice(1);

  // Normalize for fixed-depth
  nodes.forEach(d => (d.y = d.depth * 180));

  // ****************** Nodes section ***************************

  // Update the nodes...
  let node = svg.selectAll("g.node").data(nodes, d => d.id || (d.id = ++i));

  // Enter any new modes at the parent's previous position.
  let nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => "translate(" + source.y0 + "," + source.x0 + ")")
    .on("click", click);

  // Add Circle for the nodes
  nodeEnter
    .append("circle")
    .attr("class", "node")
    .attr("r", 1e-6)
    .style("fill", d => (d._children ? "lightsteelblue" : "#fff"));

  // Add labels for the nodes
  nodeEnter
    .append("text")
    .attr("dy", ".35em")
    .attr("x", d => (d.children || d._children ? -13 : 13))
    .attr("text-anchor", d => (d.children || d._children ? "end" : "start"))
    .text(d => d.data.name);

  // UPDATE
  let nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate
    .transition()
    .duration(duration)
    .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

  // Update the node attributes and style
  nodeUpdate
    .select("circle.node")
    .attr("r", 10)
    .style("fill", d => {
      if (d.highlight) return "#ea762d";
      return d._children ? "lightsteelblue" : "#fff";
    })
    .attr("cursor", "pointer");

  // Remove any exiting nodes
  let nodeExit = node
    .exit()
    .transition()
    .duration(duration)
    .attr("transform", d => "translate(" + source.y + "," + source.x + ")")
    .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select("circle").attr("r", 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select("text").style("fill-opacity", 1e-6);

  // ****************** links section ***************************

  // Update the links...
  let link = svg.selectAll("path.link").data(links, d => d.id);

  // Enter any new links at the parent's previous position.
  let linkEnter = link
    .enter()
    .insert("path", "g")
    .attr("class", "link")
    .attr("d", d => {
      let o = { x: source.x0, y: source.y0 };
      return diagonal(o, o);
    });

  // UPDATE
  let linkUpdate = linkEnter.merge(link);

  // Transition back to the parent element position
  linkUpdate
    .transition()
    .duration(duration)
    .attr("d", d => diagonal(d, d.parent));

  // Remove any exiting links
  let linkExit = link
    .exit()
    .transition()
    .duration(duration)
    .attr("d", d => {
      let o = { x: source.x, y: source.y };
      return diagonal(o, o);
    })
    .remove();

  // Store the old positions for transition.
  nodes.forEach(d => {
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {
    path = `M ${s.y} ${s.x}
    C ${(s.y + d.y) / 2} ${s.x},
    ${(s.y + d.y) / 2} ${d.x},
    ${d.y} ${d.x}`;

    return path;
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d, root);
  }
};

(function($) {
  $(document).ready(function() {
    if (typeof switch_is_present == "undefined") mountTree();
    showSearch();
  });
})(jQuery);
