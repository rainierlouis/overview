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
  let svg = d3v4.select("#graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3v4.zoom()
    .scaleExtent([0.4, 4])
    .on("zoom", () => {
      svg.attr("transform", d3v4.event.transform)
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

  //V4
  var simulation = d3v4.forceSimulation(tree.nodes)
      .force("charge", d3v4.forceManyBody())
      .force("collide",d3v4.forceCollide(15))
      // .force("link", d3v4.forceLink(tree.links).strength(.09))
      .force("link", d3v4.forceLink(tree.links).strength(0.1))
      .force("center", d3v4.forceCenter(width / 2, height / 2))
      .on("tick", ticked);


  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(tree.links)
    .enter().append("line")
    .attr("stroke", "darkgrey")
    .attr("stroke-width", 2 );

  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(tree.nodes)
    .enter().append("g")

  var circles = node.append("circle")
      .attr("r", 10)
      .attr("fill", "lightsteelblue")
      .on("mouseover", mouseOver(.2))
      .on("mouseout", mouseOut)
      .call(d3v4.drag())
          // .on("start", dragstarted)
          // .on("drag", dragged)
          // .on("end", dragended));

  var lables = node.append("text")
      .text(function(d) {
        return d.name;
      })
      .attr('x', 8)
      .attr('y', 12);

  node.append("title")
      .text(function(d) { return d.name; });

  simulation
      .nodes(tree.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(tree.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
  }

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
