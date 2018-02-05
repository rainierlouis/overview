var sources = {
  "current": "firstAttempt",
  "sample": {
    "path": "/data/sampleTreeData.json",
    "createGetChildrenFunction": function(treeData) { return undefined },
    "getRoot": function(treeData){
      return treeData
    }
  },
  "firstAttempt": {
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
  "secondAttempt": {
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
  if(typeof switch_is_present == 'undefined') mountTree()
}

var simulation

function unmountTree() {
  if(simulation !== undefined) simulation.on('tick', null)
}

function mountTree() {

  var colorScale = ['orange', 'lightblue', '#B19CD9'];
  //var xCenter = [100, 300, 500]
  var forceYByLevelValues = [50,150,250,350]

  // set the dimensions and margins of the diagram
  var margin = {top: 40, right: 90, bottom: 50, left: 90},
    width = 860 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var treemap = d3v4.tree()
    .size([width, height]);

  var dataSource = sources[sources.current]
  var ChildrenFunctionGenerator = dataSource['createGetChildrenFunction']
  var childrenFunctionForHierarchy = ChildrenFunctionGenerator(treeData)
  var rootForHierarchy = dataSource['getRoot'](treeData, childrenFunctionForHierarchy)
  var nodesHierarchy = d3v4.hierarchy(rootForHierarchy, childrenFunctionForHierarchy)

  var nodes = treemap(nodesHierarchy)
  var links = nodesHierarchy.links()

  simulation = d3v4.forceSimulation(nodes)
    .force(
      'center x to treepositions',
      d3v4.forceX(function(d){return d.x}).strength(200)
    )
    .force(
      'center y to treepositions',
      d3v4.forceY(function(d){return d.y}).strength(200)
    )
    .force('charge', d3v4.forceManyBody().strength(80))
    .force('collision', d3v4.forceCollide().radius(function(d) {
      return d.radius || 40;
    }))
    .on('tick', ticked)

  var svg =  d3v4.select('#graph').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

  var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  function ticked() {
    var edges = d3v4.select('svg g')
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

    edges.exit().remove()

    var node = svg.select('g').selectAll('.node')
        .data(nodes.descendants())
        .attr('transform', function(d) {
          // console.log('trans: ' + d.x + ',' + d.y);
            return 'translate(' + d.x + ',' + d.y + ')';
          })
      .enter().append('g')
        .attr('class', function(d) {
          return 'node' +
            (d.children ? ' node--internal' : ' node--leaf'); })
        .call(d3v4.drag()
            .on('drag', dragged)
        )

    node.append('circle')
      .attr('r', 10)
      .attr('style',function(d){
        // http://www.color-hex.com/color-palette/53835
        var color = d.data.type==='container'?'#b4e2f4':'#f9eeb8'
        return 'fill:'+color+';'
      })
      // .style('cursor','pointer') // -> css @TODO: discuss this

    node.append('text')
      .attr('dy', '.35em')
      .attr('y', function(d) { return d.children ? -20 : 20; })
      .text(function(d) { return d.data.name; })
      .classed('name', true)

    node.append('text')
      .attr('y', function(d) { return d.children ? 20 : -15; })
      // .text(function(d) { return Math.round(d.x) + ' / ' + Math.round(d.y) })
      .text(function(d) { return Math.random() + ' / ' + Math.random() })
      .classed('info', true)
      .call(function(d) {})

    node.selectAll('text.info')
      .style('stroke','green')
      .text(function(d) { return Math.round(d.x) + ' / ' + Math.round(d.y) })
  }

  function dragged(d) {
    d.x = d3v4.event.x;
    d.y = d3v4.event.y;
    d3v4.select(this)
      .attr('transform', function(d) {
        return 'translate(' + d3.event.x + ',' + d3.event.y + ')';
      })
    var links = g.selectAll('line.link')
    // ticked()
  }

  ticked()
  ticked()

}
