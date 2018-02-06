function unmountTree() {
  // @TODO: look for things to clean up and tidy them here
}

function showSearch() {
  let jqSearch = $(`
    <div class="graphsearch">
      <input placeholder="hello text"/>
    </div>
    `);
  $(jqSearch).insertAfter("#switch");
  $(".graphsearch input").on("input", function(e) {
    console.log($(e.delegateTarget).val());
  });
}

function mountTree() {
  function Unfoldable(data) {
    this.loadedTreeData = data; // store old object
    console.log(this.loadedTreeData);
    this.treeData = this.convertJson(this.loadedTreeData);
    console.log(this.treeData);

    this.init(this.treeData);
    // Collapse after the second level
    var thisref = this;
    this.root.children.forEach(function(child, i) {
      thisref.collapse.call(thisref, child);
    });
    // unfoldToLevel(root, 3);
  }

  Unfoldable.prototype.update = function(source) {
    // Assigns the x and y position for the nodes
    var treeData = this.treemap(this.root);

    // Compute the new tree layout.
    var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
      d.y = d.depth * 180;
    });

    // ****************** Nodes section ***************************

    // Update the nodes...
    var node = this.svg.selectAll("g.node").data(nodes, function(d) {
      return d.id || (d.id = ++this.i);
    });

    // Enter any new modes at the parent's previous position.
    var nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on("click", click);

    // Add Circle for the nodes
    nodeEnter
      .append("circle")
      .attr("class", "node")
      .attr("r", 1e-6)
      .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
      });

    // Add labels for the nodes
    nodeEnter
      .append("text")
      .attr("dy", ".35em")
      .attr("x", function(d) {
        return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", function(d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function(d) {
        return d.data.name;
      });

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate
      .transition()
      .duration(this.duration)
      .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    // Update the node attributes and style
    nodeUpdate
      .select("circle.node")
      .attr("r", 10)
      .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
      })
      .attr("cursor", "pointer");

    // Remove any exiting nodes
    var nodeExit = node
      .exit()
      .transition()
      .duration(this.duration)
      .attr("transform", function(d) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select("circle").attr("r", 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select("text").style("fill-opacity", 1e-6);

    // ****************** links section ***************************

    // Update the links...
    var link = this.svg.selectAll("path.link").data(links, function(d) {
      return d.id;
    });

    // Enter any new links at the parent's previous position.
    var linkEnter = link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = { x: source.x0, y: source.y0 };
        var diag = diagonal(o, o);
        return diag;
      });

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate
      .transition()
      .duration(this.duration)
      .attr("d", function(d) {
        return diagonal(d, d.parent);
      });

    // Remove any exiting links
    var linkExit = link
      .exit()
      .transition()
      .duration(this.duration)
      .attr("d", function(d) {
        var o = { x: source.x, y: source.y };
        return diagonal(o, o);
      })
      .remove();

    // Store the old positions for transition.
    nodes.forEach(function(d) {
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
    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      this.update(d);
    }
  };

  Unfoldable.prototype.init = function(data) {
    // Set the dimensions and margins of the diagram
    (this.margin = { top: 20, right: 90, bottom: 30, left: 90 }),
      (this.width =
        $("#graph").innerWidth() - this.margin.left - this.margin.right),
      (this.height =
        $("#graph").innerHeight() - this.margin.top - this.margin.bottom);

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    this.svg = d3v4
      .select("#graph")
      .append("svg")
      .attr("width", this.width + this.margin.right + this.margin.left)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );

    this.i = 0;
    this.duration = 750;

    // declares a tree layout and assigns the size
    this.treemap = d3v4.tree().size([this.height, this.width]);

    // Assigns parent, children, height, depth
    this.root = d3v4.hierarchy(this.treeData, function(d) {
      return d.children;
    });
    this.root.x0 = this.height / 2;
    this.root.y0 = 0;

    this.update(this.root);
  };

  Unfoldable.prototype.convertJson = function(data) {
    let id = typeof data.root == "string" ? data.root : "root";
    let processed = [];
    let depth = 0;

    function replaceObjectIdsByActualObjects(id, data, processed, depth) {
      let dataObjectId = id;
      let alreadyProcessed = processed.indexOf(id) != -1;
      processed.push(dataObjectId);
      let actualDataObject = data[dataObjectId];
      let newChildrenArray;
      let childrenSupressedToAvoidRecursion;
      if (!alreadyProcessed) {
        newChildrenArray = actualDataObject.children.map(function(childId) {
          return replaceObjectIdsByActualObjects(
            childId,
            data,
            processed,
            depth + 1
          );
        });
        childrenSupressedToAvoidRecursion = false;
      } else {
        childrenSupressedToAvoidRecursion =
          actualDataObject.children.length > 0;
        newChildrenArray = [];
      }
      let copyOfObjectWithNewChildren = Object.assign({}, actualDataObject, {
        children: newChildrenArray
      });
      return copyOfObjectWithNewChildren;
    }

    let result = replaceObjectIdsByActualObjects(id, data, processed, depth);
    return result;
  };

  Unfoldable.prototype.traverse = function(node, func) {
    let goDeeper = func(node);
    let toBeTraversed = node["children"] || node["_children"] || [];
    if (goDeeper !== false)
      toBeTraversed.forEach(function(node) {
        traverse(node, func);
      });
  };

  Unfoldable.prototype.unfoldToLevel = function(root, toLevel) {
    traverse(root, function(node) {
      let hasUnfoldDepth = node.depth < toLevel;
      if (hasUnfoldDepth) {
        if (!node["children"]) node["children"] = node["_children"];
      } else {
        this.collapse(node);
        return false;
      }
    });
  };

  // Collapse the node and all it's children
  Unfoldable.prototype.collapse = function(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(arguments.callee);
      d.children = null;
    }
  };

  var unfoldable = new Unfoldable(data);
}

// window.onload = function() {
//
// };
(function($) {
  $(document).ready(function() {
    if (typeof switch_is_present == "undefined") mountTree();
    // showSearch();
  });
})(jQuery);
//
