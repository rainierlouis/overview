var data = [
  { "id": 0, "depth": 0, "children": [1, 2, 3, 4, 5] },
  { "id": 1, "depth": 1, "children": [10, 11, 12, 13, 14] },
  { "id": 2, "depth": 1, "children": [20, 21, 22, 23, 24] },
  { "id": 3, "depth": 1, "children": [30, 31, 32, 33, 34] },
  { "id": 4, "depth": 1, "children": [40, 41, 42, 43, 44] },
  { "id": 5, "depth": 1, "children": [50, 51, 52, 53, 54] },
  { "id": 10, "depth": 2 },
  { "id": 11, "depth": 2 },
  { "id": 12, "depth": 2 },
  { "id": 13, "depth": 2 },
  { "id": 14, "depth": 2 },
  { "id": 20, "depth": 2 },
  { "id": 21, "depth": 2 },
  { "id": 22, "depth": 2 },
  { "id": 23, "depth": 2 },
  { "id": 24, "depth": 2 },
  { "id": 30, "depth": 2 },
  { "id": 31, "depth": 2 },
  { "id": 32, "depth": 2 },
  { "id": 33, "depth": 2 },
  { "id": 34, "depth": 2 },
  { "id": 40, "depth": 2 },
  { "id": 41, "depth": 2 },
  { "id": 42, "depth": 2 },
  { "id": 43, "depth": 2 },
  { "id": 44, "depth": 2 },
  { "id": 50, "depth": 2 },
  { "id": 51, "depth": 2 },
  { "id": 52, "depth": 2 },
  { "id": 53, "depth": 2 },
  { "id": 54, "depth": 2 }
]

var width = 960;
var height = 500;
var tree;

var force = d3.layout.force()
  .charge(-800)
  .size([width, height]);

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);


tree = {
  nodes: data,
  links: getLinks(data)
};

updateForce();


function updateForce(focusNode) {
  var link = svg.selectAll(".link").data(tree.links);
  var node = svg.selectAll(".node").data(tree.nodes);
  var nodeGroup;

  focusNode = focusNode || _.find(tree.nodes, {
    depth: 0
  });

  console.log("Update with focus on node " + focusNode.id);

  force
    .nodes(tree.nodes)
    .links(tree.links)
    .start();

  link.enter()
    .append("line")
    .attr("class", "link");

  nodeGroup = node.enter()
    .append("g")
    .attr("class", "node")
    .call(force.drag);

  nodeGroup.append("circle")
    .attr("r", 6)
    .on("click", function(d) {
      updateForce(d);
    });

  nodeGroup.append("text")
    .text(function(d) {
      return d.id;
    })
    .attr("y", 18)
    .on("click", function(d) {
      updateForce(d);
    });

  force.on("tick", function() {
    link
      .attr("x1", function(d) {
        return d.source.x;
      })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });
    node
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
  });

}

function getLinks(data) { // Gets links from nodes data
  return _.flatten(_.map(_.filter(data, "children"), function(source, i) {
    return _.map(source.children, function(target) {
      return {
        "source": i,
        "target": _.findIndex(data, {
          id: target
        })
      };
    });
  }));
}
