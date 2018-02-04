function mountRadial() {
    "use strict"

  var width = document.body.clientWidth;
  var height = document.body.clientHeight;
  var tree;
  var min_zoom = 0.1;
  var max_zoom = 7;

  var force = d3v3.layout.force()
    .charge(-800)
    .size([width, height]);

  var zoom = d3v3.behavior.zoom()
      .scaleExtent([1, 10])
      .on("zoom", zoomed);

  var drag = d3v3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", dragstarted)
      .on("drag", dragged)
      .on("dragend", dragended);

  var svg = d3v3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(zoom);



  var render = (data) => {
    var arr = [];
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

  function zoomed() {
          container.attr("transform", "translate(" + d3v3.event.translate + ")scale(" + d3v3.event.scale + ")");
        }

  function dragstarted(d) {
    d3v3.event.sourceEvent.stopPropagation();

    d3v3.select(this).classed("dragging", true);
    force.start();
  }

  function dragged(d) {

    d3v3.select(this).attr("cx", d.x = d3v3.event.x).attr("cy", d.y = d3v3.event.y);

  }

  function dragended(d) {

    d3v3.select(this).classed("dragging", false);
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
