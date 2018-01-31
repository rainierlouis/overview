var sources = {
  "current": "secondReal",
  "sample": {
    "path": "/data/sampleTreeData.json",
    "createGetChildrenFunction": function(treeData) { return undefined },
    "getRoot": function(treeData){
      return treeData
    }
  },
  "firstReal": {
    "path": "/data/first_test_data.json",
    "createGetChildrenFunction": function(treeData) {
      return function(currentNode) {
        var td = treeData
        return currentNode.children.map(function(childId){
          return td[childId]
        })
      }
    },
    "getRoot": function(treeData){
      return treeData[treeData.root]
    }
  },
  "secondReal": {
    "path": "/data/secondAttempt.json",
    "createGetChildrenFunction": function(treeData) {
      return function(currentNode) {
        var td = treeData
        return currentNode.children.map(function(childId){
          return td[childId]
        })
      }
    },
    "getRoot": function(treeData){
      return treeData[treeData.root]
    }
  }
}

window.onload = function() {
  console.log(treeData);

  var colorScale = ['orange', 'lightblue', '#B19CD9'];
  //var xCenter = [100, 300, 500]
  var forceYByLevelValues = [50,150,250,350]

  // set the dimensions and margins of the diagram
  var margin = {top: 40, right: 90, bottom: 50, left: 90},
    width = 660 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var treemap = d3.tree()
    .size([width, height]);

  var dataSource = sources[sources.current]
  var ChildrenFunctionGenerator = dataSource['createGetChildrenFunction']
  var childrenFunctionForHierarchy = ChildrenFunctionGenerator(treeData)
  var rootForHierarchy = dataSource['getRoot'](treeData, childrenFunctionForHierarchy)
  var nodesHierarchy = d3.hierarchy(rootForHierarchy, childrenFunctionForHierarchy)

  var nodes = treemap(nodesHierarchy)
  // var links = nodesHierarchy.links()

  var simulation = d3.forceSimulation(nodes)
    .force(
      'center x to treepositions',
      d3.forceX(function(d){return d.x})
    )
    .force(
      'center y to treepositions',
      d3.forceY(function(d){return d.y})
    )
    // .force('charge', d3.forceManyBody().strength(-80))
    // .force('y', d3.forceY().strength(200).y(height/2))
    // .force('collision', d3.forceCollide().radius(function(d) {
    //   return d.radius;
    // }))
    .on('tick', ticked);

  var svg =  d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    //
  var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  function ticked() {
    var edges = d3.select('svg g')
    .selectAll('line')
    .data(nodesHierarchy.links())

    edges.enter()
      .data(nodesHierarchy.links())

      .append('line')
      .merge(edges)
      .attr('x1', function(d) {
        return d.source.x
      })
      .attr('y1', function(d) {
        return d.source.y
      })
      .attr('x2', function(d) {
        return d.target.x
      })
      .attr('y2', function(d) {
        return d.target.y
      })
      .attr('stroke', 'grey')
      .attr('stroke-width', 0.4)

    edges.exit().remove()

    var node = svg.select('g').selectAll('.node')
        .data(nodes.descendants())
      .enter().append('g')
        .attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')';
        })
        .attr('class', function(d) {
          return 'node' +
            (d.children ? ' node--internal' : ' node--leaf'); })
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))

    node.append('circle')
      .attr('r', 10)
      .attr('style',function(d){
        // http://www.color-hex.com/color-palette/53835
        var color = d.data.type==='container'?'#b4e2f4':'#f9eeb8'
        return 'fill:'+color+'; stroke:darkgrey; stroke-width:3'
      })
      .style('cursor','pointer')

    // adds the text to the node
    node.append('text')
      .attr('dy', '.35em')
      .attr('y', function(d) { return d.children ? -20 : 20; })
      .style('text-anchor', 'middle')
      .text(function(d) { return d.data.name; });
  }

  //https://bl.ocks.org/d3noob/204d08d309d2b2903e12554b0aef6a4d
  function dragstarted(d) {
    console.log(d3.event);
    d.x += d3.event.x + d3.event.dx;
    d.y += d3.event.y;
    d3.select(this).raise().classed('active', true);
  }

  function dragged(d) {
    d.x = d3.event.x;
    d.y = d3.event.y;
    d3.select(this)
      .attr('transform', function(d) {
        // console.log('d.x',d.x);
        // console.log('d3.event.x', d3.event.x);
        // console.log('d3.event.dx', d3.event.dx);
        return 'translate(' + d3.event.x + ',' + d3.event.y + ')';
      })
    var links = g.selectAll('line.link')
    ticked()
  }

  function dragended(d) {
    d.x = null;
    d.y = null;
    d3.select(this).classed('active', false);
  }

  ticked()

}
