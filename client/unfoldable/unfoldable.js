var unfo;

const mountTree = () => {
  unfo = new Unfoldable();
  return unfo;
};

class Unfoldable {
  constructor() {
    let tree = this.prepareData(data);
    let margin = { top: 20, right: 90, bottom: 30, left: 90 },
      width = $("#graph").innerWidth() - margin.left - margin.right,
      height = $("#graph").innerHeight() - margin.top - margin.bottom;

    this.width = width;

    this.svg = d3v4
      .select("#graph")
      .append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.treemap = d3v4.tree().size([height, width]);

    this.root = d3v4.hierarchy(tree, function(d) {
      return d.children;
    });
    this.root.x0 = height / 2;
    this.root.y0 = 0;

    this.unfoldToLevel(this.root, 3);
    this.update(this.root, this.root);
  }

  prepareData(data) {
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
  }

  traverse(func, node) {
    if (!node) node = this.root;
    let funcSaysStopRecursing = func(node) === false;
    let nodeHasChildrenArray = node["children"] && Array.isArray(node.children);
    if (!funcSaysStopRecursing && nodeHasChildrenArray)
      node.children.forEach(node => this.traverse(func, node));
  }

  unfoldToLevel(root, toLevel) {
    this.traverse(node => {
      if (node.depth <= toLevel && node.children) {
        return true;
      } else {
        this.collapse(node);
        return false;
      }
    }, root);
  }

  collapse(node) {
    if (node.children)
      node.children.forEach(child => this.collapse.call(this, child));
  }

  update(source, root) {
    if (!source) source = this.root;
    if (!root) root = this.root;

    let i = 0;
    let duration = 500;

    // Assigns the x and y position for the nodes
    let tree = this.treemap(root);

    // Compute the new tree layout
    let nodes = tree.descendants();
    let links = tree.descendants().slice(1);

    let maxLevel = nodes[0].height;
    let levelDistance = this.width / maxLevel;
    // Normalize for fixed-depth
    nodes.forEach(d => (d.y = d.depth * levelDistance)); // 180

    // ****************** Nodes section ***************************

    // Update the nodes...
    let node = this.svg
      .selectAll("g.node")
      .data(nodes, d => d.id || (d.id = ++i));

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
      .attr("dy", d => {
        return d.depth === 0 ? "-1.5em" : ".35em";
      })
      .attr("x", d => (d.children || d._children ? -13 : 13))
      .attr("text-anchor", d => {
        if (d.depth === 0) return "middle";
        return d.children || d._children ? "end" : "start";
      })
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
        if (d.highlight) return "#c14343";
        return d._children ? "lightsteelblue" : "#fff";
      })
      .attr("cursor", "pointer");
    // .attr("class", function(d) {
    //   return d["highlight"] && d.highlight === 1
    //     ? "highlighted"
    //     : null;
    // })

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
    let link = this.svg.selectAll("path.link").data(links, d => d.id);

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
      let path = `M ${s.y} ${s.x}
      C ${(s.y + d.y) / 2} ${s.x},
      ${(s.y + d.y) / 2} ${d.x},
      ${d.y} ${d.x}`;

      return path;
    }

    // Toggle children on click.
    var that = this;
    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      that.update(d, root);
    }
  }
}

const unmountTree = () => {};

(function($) {
  $(document).ready(function() {
    if (typeof switch_is_present == "undefined") mountTree();
    //showSearch();
  });
})(jQuery);
