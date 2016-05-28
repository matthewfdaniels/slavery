var allPoints;

d3.csv("allpoints.csv", function(error, allPoints) {

  var margin = {top: 50, right: 0, bottom: 20, left:0},
      width = 516 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;

  // left: -513210
  // right: 2538264
  // top: 2048594
  // bottom: -1595224
  var xExtent = d3.extent(allPoints, function(d) { return +d.x });
  var yExtent = d3.extent(allPoints, function(d) { return +d.y });

  var xMapScale = d3.scale.linear().domain([-513210,2538264]).range([0,width]);
  var yMapScale = d3.scale.linear().domain([-1595224,2048594]).range(0,height);

  var allPointsReMapped = [];
  for (var point in allPoints){
    var d = allPoints[point];
    var xReMap = xMapScale(+d.x);
    var yReMap = yMapScale(+d.y);
    if(+d.slaves_1860 > 0){
      allPointsReMapped.push({x:xReMap,y:yReMap});
    }
  }

  console.log(allPointsReMapped);

  var mapContainer = d3.select(".map-container")
    .selectAll("div")
    .data(allPointsReMapped)
    .enter()
    .append("div")
    .attr("class","map-point")
    .style("left",function(d){

    })
    .style("top",function(d){

    })
    ;

//allpoints.csv
});
