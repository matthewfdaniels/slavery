var bins=[[.48,1247],[1.09,1536],[1.6,1826],[2.53,2115],[4.16,2405],[5.69,2694],[6.94,2984],[8.15,3274],[9.75,3563],[11.73,3853],[13.78,4142],[16.89,4432],[20.9,4722],[24.56,5011],[29.16,5301],[34.16,5590],[39.27,5880],[45.98,6170],[52.83,6459],[59.34,6749],[67.32,7038],[75.27,7328],[84.7,7618],[95.05,7907],[105.33,8197],[116.88,8486],[128.97,8776],[144.01,9065],[160.02,9355],[178.18,9645],[200.55,9934],[227.3,10224],[255.54,10513],[286.15,10803],[320.07,11093],[366.04,11382],[444.05,11672],[539.61,11961],[632.15,12251],[722.21,12541],[809.29,12830],[898.66,13120],[994.84,13409],[1085.72,13699],[1165.48,13989],[1246.35,14278],[1336.4,14568],[1429.57,14857],[1535.26,15147],[1643.52,15436],[1738.1,15726],[1837.15,16016],[1956.02,16305],[2080.75,16595],[2200.6,16884],[2324.76,17174],[2454.14,17464],[2593.22,17753],[2754.73,18043],[2926.97,18332],[3100.71,18622],[3272.39,18912],[3444.76,19201],[3599.78,19491],[3755.11,19780],[3898.17,20070],[4041.25,20360],[4209.47,20649],[4407,20939],[4602.94,21228],[4791.85,21518],[4980.66,21807],[5186.84,22097],[5411.3,22387],[5634.12,22676],[5868.9,22966],[6108.68,23255],[6324.42,23545],[6537.98,23835],[6731.38,24124],[6936.22,24414],[7170.12,24703],[7438.78,24993],[7722.03,25283],[8052.71,25572],[8554.9,25862],[9170.7,26151],[9918.42,26441],[10766.05,26731],[11687.98,27020],[12770.53,27310],[14131.5,27599],[15705.72,27889],[18051.67,28178],[21726.69,28468],[26932.61,28758],[33777.32,29916],[43650.08,32409],[64210.67,34902],[122791.41,37395]];
var allPoints;
var yearSelected = "1820";


d3.csv("allpoints.csv", function(error, allPoints) {
  d3.csv("line_paths.csv", function(error, borderPaths) {

  console.log(allPoints);

  var xExtent = d3.extent(allPoints, function(d) { return +d.x });
  var yExtent = d3.extent(allPoints, function(d) { return +d.y });
  // var popExtent = d3.extent(allPoints, function(d) { return +d.total_1860 });
  var dimScale = (yExtent[1]-yExtent[0])/(xExtent[1]-xExtent[0]);

  var margin = {top: 0, right: 0, bottom: 0, left:0},
      width = 460.5718*2 - margin.left - margin.right,
      height = width*dimScale - margin.top - margin.bottom;

  // left: -513210
  // right: 2538264
  // top: 2048594
  // bottom: -1595224

  var popX = bins.map(function(d){
    return d[0];
  });

  var popY = bins.map(function(d){
    return d[1];
  });

  var xMapScale = d3.scale.linear().domain(xExtent).range([0,width]);
  var yMapScale = d3.scale.linear().domain(yExtent).range([height,0]);
  var popScale = d3.scale.threshold().domain(popX).range(popY);
  var diameterAdjust = d3.scale.linear().domain([1247,37395]).range([.2,3.5]);
  var colorGradient = d3.scale.linear().domain([.000000000001,.2375,.475,.7125,.95]).range(["rgb(117, 31, 255)","rgb(166, 40, 126)","rgb(255, 85, 0)","rgb(242,206,206)","rgb(255,255,0)"]);

  var allPointsReMapped = [];
  for (var point in allPoints){
    var d = allPoints[point];
    var xReMap = xMapScale(+d.x);
    var yReMap = yMapScale(+d.y);
    allPointsReMapped.push({
      x:xReMap,y:yReMap,
      "1790":{
        total_pop:d.total_1790,
        slave_pop:d.slaves_1790
      },
      "1800":{
        total_pop:d.total_1800,
        slave_pop:d.slaves_1800
      },
      "1810":{
        total_pop:d.total_1810,
        slave_pop:d.slaves_1810
      },
      "1820":{
        total_pop:d.total_1820,
        slave_pop:d.slaves_1820
      },
      "1840":{
        total_pop:d.total_1840,
        slave_pop:d.slaves_1840
      },
      "1850":{
        total_pop:d.total_1850,
        slave_pop:d.slaves_1850
      },
      "1860":{
        total_pop:d.total_1860,
        slave_pop:d.slaves_1860
      },
      "1830":{
        total_pop:d.total_1830,
        slave_pop:d.slaves_1830
      },
      "1870":{
        total_pop:d.total_1870,
        slave_pop:0
      },
    });
  }

  var mapWrapper = d3.select(".map-wrapper")
    ;

  var menu = mapWrapper
    .append("div")
    .attr("class","menu-test")
    .selectAll("p")
    .data(["1790","1800","1810","1820","1830","1840","1850","1860","1870"])
    .enter()
    .append("p")
    .attr("class","menu-item")
    .text(function(d){
      return d;
    })
    .on("click",function(d){
      yearSelected = d;
      adjustCircles();
    })
    ;

  var svg = mapWrapper.select(".map-container")
    .attr("width","100%")
    .attr("height","100%")
    .attr("viewBox","0 0 950 950")
    ;

  function adjustCircles(){
    circles
      .each(function(d){
        d.former = d.r;
        d.r = getRadius(d);
        return d.r != 0 || former != 0;
      })
      ;

    svg.selectAll(".map-item")
      .sort(function(a,b){
        return a.r - b.r
      })
      ;

    circles
      .filter(function(d){
        return d.former != 0 || d.r != 0;
      })
      .transition()
      .duration(0)
      .delay(function(d,i){
        if(d.r>9){
          return 100;
        }
        return d.r*1000;
      })
      .attr("r",function(d){
        return getRadius(d);
      })
      .attr("fill",function(d){
        return getColor(d);
      })
      ;
  }

  function getRadius(d){
    if(d[yearSelected].total_pop == ""){
      d.r = 0;
    }
    else if (+d[yearSelected].total_pop > 122791.41) {
      d.r = 10;
    }
    else {
      d.r = diameterAdjust(popScale(d[yearSelected].total_pop));
    }
    return d.r;
  }

  function getColor(d){
    var totalPop = d[yearSelected].total_pop;
    var slavePop = d[yearSelected].slave_pop;
    if(totalPop == ""){
      totalPop = 0;
    }
    if(slavePop == ""){
      slavePop = 0;
    }
    if(totalPop == 0){
      return null;
    }
    var color = colorGradient(+slavePop/+totalPop);
    return color;
  }

  var circles = svg
    .selectAll("circle")
    .data(allPointsReMapped)
    .enter()
    .append("circle")
    .attr("class","map-point map-item")
    .attr("cx",function(d){
      return +d.x;
    })
    .attr("cy",function(d){
      return +d.y;
    })
    .attr("r",function(d){
      return 5;
      // return getRadius(d);
    })
    .attr("stroke-width",function(d){
      if(d.r>9){
        return "1"
      }
    })
    .attr("fill",function(d){
      return getColor(d);
    })
    ;

  var paths = svg
    .selectAll("path")
    .data(borderPaths)
    .enter()
    .append("path")
    .attr("class","map-item map-path")
    .attr("transform","translate(0,20) scale(1.1)")
    .attr("d",function(d){
      d.r = 8;
      return "M "+d.line;
    })
    ;

  svg.selectAll(".map-item")
    .sort(function(a,b){
      return a.r - b.r
    })
    ;

//line_paths.csv
});
//allpoints.csv
});
