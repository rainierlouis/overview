function mountRadial() {
    "use strict"

  var width = document.body.clientWidth;
  var height = document.body.clientHeight;
  var tree;
  var min_zoom = 0.1;
  var max_zoom = 7;
  var zoom = d3v3.behavior.zoom().scaleExtent([min_zoom,max_zoom])

  var force = d3v3.layout.force()
    .charge(-800)
    .size([width, height]);

  var svg = d3v3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height);

  const render = (data) => {
    // console.log(data);
    const arr = [];

    for (let i in data) {
      if (i === 'root') data[i]['depth'] = 0;
      else data[i]['depth'] = 1;
      arr.push(data[i]);
    }
    return arr;
  };

  tree = {
    nodes: render(data),
    links: getLinks(render(data))
  };
  console.log(tree);
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
        return d.name;
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
};

window.onload = function() {
  if(typeof switch_is_present == 'undefined') mountRadial()
}

function unmountRadial() {
  if(simulation !== undefined) simulation.on('tick', null)
}
