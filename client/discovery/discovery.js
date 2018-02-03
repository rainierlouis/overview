window.onload = function() {
  if(typeof switch_is_present == 'undefined') mountDiscovery()
}

function mountDiscovery() {
    "use strict"

    var width,height
    var chartWidth, chartHeight
    var margin
    var svg = d3v4.select("#graph").append("svg")
    var chartLayer = svg.append("g").classed("chartLayer", true)

    main()

    function main() {
        var range = 100
        var data = {
            // nodes:d3v4.range(0, range).map(function(d){ return {label: "l"+d ,r:~~d3v4.randomUniform(8, 28)()}}),
            nodes: d3v4.range(0,range).map( (d) => { return {label: "l"+d , r: 10 }}),
            links:d3v4.range(0, range).map(function(){ return {source:~~d3v4.randomUniform(range)(), target:~~d3v4.randomUniform(range)()} })
        }

        setSize(data)
        drawChart(data)
    }

    function setSize(data) {
        width = document.querySelector("#graph").clientWidth
        height = document.querySelector("#graph").clientHeight
        margin = {top:0, left:0, bottom:0, right:0 }


        chartWidth = width - (margin.left+margin.right)
        chartHeight = height - (margin.top+margin.bottom)

        svg.attr("width", width).attr("height", height)


        chartLayer
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("transform", "translate("+[margin.left, margin.top]+")")


    }

    function drawChart(data) {

        var simulation = d3v4.forceSimulation()
            .force("link", d3v4.forceLink().id(function(d) { return d.index }))
            .force("collide",d3v4.forceCollide( function(d){return d.r + 8 }).iterations(16) )
            .force("charge", d3v4.forceManyBody())
            .force("center", d3v4.forceCenter(chartWidth / 2, chartHeight / 2))
            .force("y", d3v4.forceY(0))
            .force("x", d3v4.forceX(0))

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .attr("stroke", "black")

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(data.nodes)
            .enter().append("circle")
            .attr("r", function(d){
              // console.log(d.r, d.index);
              return d.r
            })
            .on("mouseover", mouseOver(.2))
            .on("mouseout", mouseOut)
            .call(d3v4.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // add a label to each node
        node.append("text")
            .attr("dx", 14)
            .attr("dy", ".35em")
            .text(function(d) {
                return "hello";
            })
            // .style("stroke", "black")
            // .style("stroke-width", 0.5)
            // .style("fill", function(d) {
            //     return #ddd;
            // });

        var ticked = function() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }

        simulation
            .nodes(data.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(data.links);



        function dragstarted(d) {
            if (!d3v4.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3v4.event.x;
            d.fy = d3v4.event.y;
        }

        function dragended(d) {
            if (!d3v4.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        //count weigth by number of links
        let weight = {};
        data.links.forEach((d) => {

        })
        // build a dictionary of nodes that are linked
        var linkedByIndex = {};
        data.links.forEach(function(d) {
            linkedByIndex[d.source.index + "," + d.target.index] = 1;
        });
        // console.log(linkedByIndex);
        // check the dictionary to see if nodes are linked
        function isConnected(a, b) {
            return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
        }

        // fade nodes on hover
        function mouseOver(opacity) {
            return function(d) {
                // check all other nodes to see if they're connected
                // to this one. if so, keep the opacity at 1, otherwise
                // fade
                node.style("stroke-opacity", function(o) {
                  // console.log("D&O",d,o);
                    let thisOpacity = isConnected(d, o) ? 1 : opacity;
                    return thisOpacity;
                });
                node.style("fill-opacity", function(o) {
                    let thisOpacity = isConnected(d, o) ? 1 : opacity;
                    return thisOpacity;
                });
                // also style link accordingly
                link.style("stroke-opacity", function(o) {
                    return o.source === d || o.target === d ? 1 : opacity;
                });
                link.style("stroke", function(o){
                    return o.source === d || o.target === d ? o.source.colour : "#ddd";
                });
            };
        }

        function mouseOut() {
            node.style("stroke-opacity", 1);
            node.style("fill-opacity", 1);
            link.style("stroke-opacity", 1);
            link.style("stroke", "#ddd");
        }
    }
};



function unmountDiscovery() {
  if(simulation !== undefined) simulation.on('tick', null)
}