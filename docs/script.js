var bins=[[.48,1247],[1.09,1536],[1.6,1826],[2.53,2115],[4.16,2405],[5.69,2694],[6.94,2984],[8.15,3274],[9.75,3563],[11.73,3853],[13.78,4142],[16.89,4432],[20.9,4722],[24.56,5011],[29.16,5301],[34.16,5590],[39.27,5880],[45.98,6170],[52.83,6459],[59.34,6749],[67.32,7038],[75.27,7328],[84.7,7618],[95.05,7907],[105.33,8197],[116.88,8486],[128.97,8776],[144.01,9065],[160.02,9355],[178.18,9645],[200.55,9934],[227.3,10224],[255.54,10513],[286.15,10803],[320.07,11093],[366.04,11382],[444.05,11672],[539.61,11961],[632.15,12251],[722.21,12541],[809.29,12830],[898.66,13120],[994.84,13409],[1085.72,13699],[1165.48,13989],[1246.35,14278],[1336.4,14568],[1429.57,14857],[1535.26,15147],[1643.52,15436],[1738.1,15726],[1837.15,16016],[1956.02,16305],[2080.75,16595],[2200.6,16884],[2324.76,17174],[2454.14,17464],[2593.22,17753],[2754.73,18043],[2926.97,18332],[3100.71,18622],[3272.39,18912],[3444.76,19201],[3599.78,19491],[3755.11,19780],[3898.17,20070],[4041.25,20360],[4209.47,20649],[4407,20939],[4602.94,21228],[4791.85,21518],[4980.66,21807],[5186.84,22097],[5411.3,22387],[5634.12,22676],[5868.9,22966],[6108.68,23255],[6324.42,23545],[6537.98,23835],[6731.38,24124],[6936.22,24414],[7170.12,24703],[7438.78,24993],[7722.03,25283],[8052.71,25572],[8554.9,25862],[9170.7,26151],[9918.42,26441],[10766.05,26731],[11687.98,27020],[12770.53,27310],[14131.5,27599],[15705.72,27889],[18051.67,28178],[21726.69,28468],[26932.61,28758],[33777.32,29916],[43650.08,32409],[64210.67,34902],[122791.41,37395]];
var allPoints;
var yearSelected = "1860";

var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

// var controller = new ScrollMagic.Controller();

d3.csv("allpoints.csv", function(error, allPoints) {
  d3.json("us.json", function(error, us) {
    d3.csv("line_paths.csv", function(error, borderPaths) {

  var xExtent = d3.extent(allPoints, function(d) { return +d.x });
  var yExtent = d3.extent(allPoints, function(d) { return +d.y });

  allPoints = allPoints.filter(function(d){
    var sectionOne = false;
    if(+d.x < -112312 && +d.y > -61240){
      sectionOne = true;
    }
    return +d.total_1860 > 0 && +d.x > -519447 && !sectionOne;
  })

  //8427 - 8419

  // var popExtent = d3.extent(allPoints, function(d) { return +d.total_1860 });
  var dimScale = (yExtent[1]-yExtent[0])/(xExtent[1]-xExtent[0]);

  var margin = {top: 0, right: 0, bottom: 0, left:0},
      width = 460.5718*2 - margin.left - margin.right,
      height = width*dimScale;

  console.log(width,height);

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
  var diameterAdjust = d3.scale.linear().domain([1247,37395]).range([.2,3.7]).clamp(true);
  // var colorGradient = d3.scale.linear().domain([.000000000001,.2375,.475,.7125,.95]).range(["rgb(80, 31, 255)","rgb(166, 40, 126)","rgb(255, 85, 0)","rgb(242,206,206)","rgb(255,255,0)"])
  // .interpolate(d3.interpolateHcl);
  // var colorGradient = d3.scale.linear().domain([.000000000001,.2375,.475,.7125,.95]).range(["#431ad5","rgb(166, 40, 126)","rgb(255, 85, 0)","rgb(242,206,206)","rgb(255,255,0)"])
  var colorGradient = d3.scale.linear().domain([.000000000001,.2375,.475,.7125,.95]).range(["#194abf","rgb(166, 40, 126)","rgb(255, 85, 0)","rgb(242,206,206)","rgb(255,255,0)"])
  .interpolate(d3.interpolateHcl);

  // var colorGradient = d3.scale.linear().domain([.000000000001,.2375,.475,.7125,.95]).range(["#c5c5c5","#ffae53","#ff5f07","#d60155","#8401a9"]);
  // var colorGradient = d3.scale.linear().domain([.000000000001,.2375,.475,.7125,.95]).range(["#c5c5c5","#ffffb2","#fecc5c","#fd8d3c","#e31a1c"]);
  // var colorGradient = d3.scale.linear().domain([.000000000001,.2375,.475,.7125,.95]).range(["#0c679c","#333333","#491e2a","#831937","#ac1640"]);

  console.log();

  var allPointsReMapped = [];
  for (var point in allPoints){
    var d = allPoints[point];
    var xReMap = xMapScale(+d.x);
    var yReMap = yMapScale(+d.y);
    allPointsReMapped.push({
      x:xReMap,y:yReMap,
      point_id:d.point_id,
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
    .style("height",viewportHeight-200+"px")
    .style("width",Math.min(viewportHeight-140,550)+"px")
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
    .attr("viewBox","350 0 580 580")
    ;

  var defs = svg.append("defs");

    //Create wrapper for the voronoi clip paths
  var clipWrapper = defs.append("g").attr("class", "clip-group-wrapper");

  var filter = defs.append("filter")
    .attr("width", "300%")
    .attr("x", "-100%")
    .attr("height", "300%")
    .attr("y", "-100%")
    .attr("id","glow");

  filter.append("feGaussianBlur")
    .attr("class", "blur")
    .attr("stdDeviation","5")
    .attr("result","coloredBlur");

  var feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode")
    .attr("in","coloredBlur");
  feMerge.append("feMergeNode")
    .attr("in","SourceGraphic");

    //Blur for the royal leaders
  var filterIntense = defs.append("filter")
    .attr("width", "300%")
    .attr("x", "-100%")
    .attr("height", "300%")
    .attr("y", "-100%")
    .attr("id","glow-intense");

  filterIntense.append("feGaussianBlur")
    .attr("class", "blur")
    .attr("stdDeviation","3")
    .attr("result","coloredBlur");

  function adjustCircles(){

    // svg.selectAll(".map-item")
    //   .sort(function(a,b){
    //     return a.r - b.r
    //   })
    //   ;

    circles
      .each(function(d){
        d.r = getRadius(d);
      })
      .transition()
      .duration(function(d){
        if(d.r>8){
          return 1000;
        }
        return 0;
      })
      .delay(function(d,i){
        if(d.r>8){
          return 0;
        }
        return d.r*1000;
      })
      .style("stroke-width",function(d){
        if(d.r>8){
          return .75
        }
      })
      .attr("r",function(d){
        return d.r;
      })
      .attr("stroke-width",function(d){
        if(d.r>8){
          return .75
        }
        return null;
      })
      .attr("stroke",function(d){
        if(d.r>8){
          return "#0a061b";
        }
        return null;
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

  function makeLegends(){
    var slaveryLegend = d3.select(".slavery-legend");
    var populationLegend = d3.select(".population-legend");

    var slaveryLegendItem = slaveryLegend.selectAll("div")
      .data(colorGradient.domain())
      .enter()
      .append("div")
      .attr("class","slavery-legend-item")
      ;

    slaveryLegendItem.append("div")
      .attr("class","slavery-legend-circle")
      .style("background-color",function(d){
        return colorGradient(d);
      })
      ;

    slaveryLegendItem.append("p")
      .attr("class","slavery-legend-text")
      .style("color",function(d){
        return colorGradient(d);
      })
      .html(function(d,i){
        if(i==0){
          return "0%"
        }
        return Math.round(d*100)+"%";
      })
      ;

    var popInterpolate = ["100","1k","50k","1m+"]

    var populationLegendItem = populationLegend.selectAll("div")
      .data([100,1000,50000,1000000])
      .enter()
      .append("div")
      .attr("class","population-legend-item")
      ;

    populationLegendItem.append("div")
      .attr("class","population-legend-circle")
      .style("width",function(d,i){
        if(i==0){
          return "1px"
        }
        if(i==3){
          return "18px"
        }
        return 2*diameterAdjust(popScale(d))+"px";
      })
      .style("height",function(d,i){
        if(i==0){
          return "1px"
        }
        if(i==3){
          return "18px"
        }
        return 2*diameterAdjust(popScale(d))+"px";
      })
      ;

    populationLegendItem.append("p")
      .attr("class","population-legend-text")
      .html(function(d,i){
        return popInterpolate[i];
      })
      ;



  }

  makeLegends();

  allPointsReMapped = allPointsReMapped.filter(function(d){
    return getRadius(d) > 0;
  })

  var slaveryMapContainer = svg.append("g")
    .attr("transform","translate("+margin.left+","+margin.top+")")
    ;

  var circles = slaveryMapContainer
    .selectAll("circle")
    .data(allPointsReMapped)
    .enter()
    .append("circle")
    .attr("class","map-point map-item")
    .attr("cx",function(d){
      return +d.x.toFixed(2);
    })
    .attr("cy",function(d){
      return +d.y.toFixed(2);
    })
    .attr("r",function(d){
      return d.r.toFixed(2);
    })
    .attr("stroke-width",function(d){
      if(d.r>8){
        return .75
      }
      return null;
    })
    .attr("stroke",function(d){
      if(d.r>8){
        return "#0a061b";
      }
      return null;
    })
    .attr("fill",function(d){
      return getColor(d);
    })
    ;

  var remove = [2,4,6,8,20,27,30,31,32,35,38,40,46,49,56];

  var object = {type:"GeometryCollection",geometries:us.objects.states.geometries.filter(function(d){
    return remove.indexOf(d.id) == -1;
  })}

  var paths = slaveryMapContainer.append("path")
    .datum(topojson.mesh(us, object, function(a, b) {
      return a !== b;
    }))
    .attr("class","map-path map-item")
    .attr("transform","translate(-115,-15) scale(1.2)")
    .each(function(d){
      d.r = 8;
    })
    .attr("stroke",function(d){
      return "#0a061b";
    })
    .attr("fill","none")
    .attr("d", d3.geo.path())
    // .attr("stroke","#0a061b")
    .attr("stroke-width",1)
    // .attr("fill","none")
    ;

  slaveryMapContainer.selectAll(".map-item")
    .sort(function(a,b){
      return a.r - b.r
    })
    ;

  // var pinSampleGrid = new ScrollMagic.Scene({
  //     // triggerElement: ".third-chart-wrapper",
  //     triggerElement: ".map-wrapper",
  //     triggerHook:0,
  //     offset: 0
  //   })
  //   // .addIndicators({name: "pin 3 chart"}) // add indicators (requires plugin)
  //   .setPin(".map-wrapper", {pushFollowers: false})
  //   .addTo(controller)
  //   ;


//us.json
});
//line_paths.csv
});
//allpoints.csv
});
