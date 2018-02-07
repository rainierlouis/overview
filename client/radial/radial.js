function mountRadial() {
    "use strict"

  const width = document.body.clientWidth;
  const height = document.body.clientHeight;
  let tree;
  let linkedNodes = {};

  // const force = d3v3.layout.force()//d3v4.forceSimulation
  //   .charge(-800)//d3v4.forceManyBody() >>>> // manyBody.strength([strength]) // manyBody.theta([theta]) // manyBody.distanceMin([distance]) // manyBody.distanceMax([distance])
  //   .size([width, height]); //x.x & y.y

  //V4
  let simulation = d3v4.forceSimulation()
    .force("charge", d3v4.forceManyBody())
    // .strength(-100)


  //V4
  let svg = d3v4.select("#graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3v4.zoom()
    .scaleExtent([0.4, 4])
    .on("zoom", () => {
      svg.attr("transform", d3v3.event.transform)
    }))
    .append("g")

  // let svg = d3v3.select("#graph").append("svg")
  //   .attr("width", width)
  //   .attr("height", height)
  //   .call(d3v3.behavior.zoom() // d3v4.zoom()
  //   .scaleExtent([0.4, 4])
  //   .on("zoom", function () {
  //     svg.attr("transform", "translate(" + d3v3.event.translate + ")" + " scale(" + d3v3.event.scale + ")")
  //   })) // event.tranform.x && event.transform.y // event.transform.k
  //   .append("g")

  const render = (data) => {
    let arr = [];
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

  updateForce();

  function updateForce(focusNode) {
    var link = svg.selectAll(".link").data(tree.links);
    var node = svg.selectAll(".node").data(tree.nodes);
    var container;

    focusNode = focusNode || _.find(tree.nodes, {
      depth: 0
    });

    //V4

    simulation
      .nodes(tree.nodes)

    // force
    //   .nodes(tree.nodes)
    //   .links(tree.links) //d3v4.forceLinks([links]) >>> // link.links([links]) // link.distance([distance]) // link.strength([strength]) // link.iterations([iterations])
    //   .start();

    link.enter()
      .append("line")
      .attr("class", "link");

    container = node.enter()
      .append("g")
      .on("mouseover", mouseOver(.1))
      .on("mouseout", mouseOut)
      .attr("class", "node");

    container.append("circle")
      .attr("r", 10);

    container.append("text")
      .text(function(d) {
        return d.name;
      })
      .attr("x", 8)
      .attr("y", 18);

    tree.links.forEach((d) => {
        linkedNodes[d.source.index + "," + d.target.index] = 1;
    });

    const isConnected = (a, b) => {
        return linkedNodes[a.index + "," + b.index] || linkedNodes[b.index + "," + a.index] || a.index == b.index;
    };

    function mouseOver(opacity) {
        return function(d) {

            node.style("stroke-opacity", function(o) {
                let thisOpacity = isConnected(d, o) ? 1 : opacity;
                return thisOpacity;
            });
            node.style("fill-opacity", function(o) {
                let thisOpacity = isConnected(d, o) ? 1 : opacity;
                return thisOpacity;
            });
            link.style("stroke-opacity", function(o) {
                return o.source === d || o.target === d ? 1 : opacity;
            });
            link.style("stroke", function(o){
                return o.source === d || o.target === d ? o.source.colour : "#ddd";
            });
        };
    };

    function mouseOut() {
        node.style("stroke-opacity", 1);
        node.style("fill-opacity", 1);
        link.style("stroke-opacity", 1);
        link.style("stroke", "#ddd");
    };
    //V4 force switched to simulation
    simulation.on("tick", function() {
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

  function getLinks(data) {
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
