var slaveZoomed = false;
var bins=[[.48,1247],[1.09,1536],[1.6,1826],[2.53,2115],[4.16,2405],[5.69,2694],[6.94,2984],[8.15,3274],[9.75,3563],[11.73,3853],[13.78,4142],[16.89,4432],[20.9,4722],[24.56,5011],[29.16,5301],[34.16,5590],[39.27,5880],[45.98,6170],[52.83,6459],[59.34,6749],[67.32,7038],[75.27,7328],[84.7,7618],[95.05,7907],[105.33,8197],[116.88,8486],[128.97,8776],[144.01,9065],[160.02,9355],[178.18,9645],[200.55,9934],[227.3,10224],[255.54,10513],[286.15,10803],[320.07,11093],[366.04,11382],[444.05,11672],[539.61,11961],[632.15,12251],[722.21,12541],[809.29,12830],[898.66,13120],[994.84,13409],[1085.72,13699],[1165.48,13989],[1246.35,14278],[1336.4,14568],[1429.57,14857],[1535.26,15147],[1643.52,15436],[1738.1,15726],[1837.15,16016],[1956.02,16305],[2080.75,16595],[2200.6,16884],[2324.76,17174],[2454.14,17464],[2593.22,17753],[2754.73,18043],[2926.97,18332],[3100.71,18622],[3272.39,18912],[3444.76,19201],[3599.78,19491],[3755.11,19780],[3898.17,20070],[4041.25,20360],[4209.47,20649],[4407,20939],[4602.94,21228],[4791.85,21518],[4980.66,21807],[5186.84,22097],[5411.3,22387],[5634.12,22676],[5868.9,22966],[6108.68,23255],[6324.42,23545],[6537.98,23835],[6731.38,24124],[6936.22,24414],[7170.12,24703],[7438.78,24993],[7722.03,25283],[8052.71,25572],[8554.9,25862],[9170.7,26151],[9918.42,26441],[10766.05,26731],[11687.98,27020],[12770.53,27310],[14131.5,27599],[15705.72,27889],[18051.67,28178],[21726.69,28468],[26932.61,28758],[33777.32,29916],[43650.08,32409],[64210.67,34902],[122791.41,37395]];
var allPoints;
var yearSelected = "1860";
var yearPopulationSelected = "2010";
var yearIncarcerationSelected = "2014";
var yearBubblesVisible = false;
var contentContainerWidth;
var heightPadding;
var uiSelected;
var commaFormat = d3.format(",");
var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var chapterItemes = d3.selectAll(".chapter-item");
var slaveryYear = d3.select(".year-row-year");
var remove = [2,4,6,8,20,27,30,31,32,35,38,40,46,49,56];
var scaleNote = d3.select(".scale-note");
var navigatorElement = d3.select(".navigator");

var controller = new ScrollMagic.Controller();

d3.csv("allpoints.csv", function(error, allPoints) {
  d3.json("us.json", function(error, us) {
    d3.csv("line_paths.csv", function(error, borderPaths) {
      d3.csv("population.csv", function(error, populationData) {
        d3.csv("incarceration.csv", function(error, incarcerationData) {
          d3.csv("admissions.csv", function(error, admissionsData) {
            d3.csv("jail.csv", function(error, jailData) {

  var uiElements = d3.selectAll(".ui-elements");

  incarcerationData = incarcerationData.filter(function(d){
    return +d.id != 11;
  })

  var admissionsMap = d3.map(admissionsData,function(d){
    return d.fips;
  });

  var populationMap = d3.map(populationData,function(d){
    return d.county;
  });

  var incarcerationMap = d3.map(incarcerationData,function(d){
    return +d.id;
  })

  var jailMap = d3.map(jailData,function(d){
    return +d.county;
  })

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
  var diameterAdjust = d3.scale.linear().domain([1247,37395]).range([.2,3.7]).clamp(false);

  // var colors = ["#194abf","rgb(166, 40, 126)","rgb(255, 85, 0)","rgb(242,206,206)","rgb(255,255,0)"]
  var colors = ["#220e79","rgb(166, 40, 126)","rgb(255, 85, 0)","rgb(242,206,206)","rgb(255,255,0)"]


  var colorGradient = d3.scale.linear().domain([.000000000001,.2375,.475,.7125,.95]).range(colors)
    .interpolate(d3.interpolateHcl);




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


  var populationContainer = d3.select(".population-container")
  var populationWrapper = populationContainer.select(".map-population-wrapper")
    ;

  var incarcerationContainer = d3.select(".incarceration-container");

  var incarcerationWrapper = incarcerationContainer.select(".map-incarceration-wrapper")
    ;

  var slaveryContainer = d3.select(".slavery-container");

  var mapWrapper = slaveryContainer.select(".map-wrapper")
    // .style("height",viewportHeight-200+"px")
    // .style("width",Math.min(viewportHeight-200,550)+"px")
    ;

  var svg = mapWrapper.select(".map-container")
    .attr("width","100%")
    .attr("height","100%")
    .attr("viewBox","350 0 580 580")
    ;

  svg.append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("x", 270)
    .attr("y", 0)
    .attr("width", 770)
    .attr("height", 580)
    ;

  svg.attr("clip-path", "url(#clip)")

  var svgPopulation = populationWrapper.select("svg")
    .attr("width","100%")
    .attr("height","100%")
    .attr("viewBox","350 0 580 580")
    ;

  var svgIncarceration = incarcerationWrapper.select("svg")
    .attr("width","100%")
    .attr("height","100%")
    .attr("viewBox","350 0 580 580")
    ;

  function adjustCircles(duration){

    // svg.selectAll(".map-item")
    //   .sort(function(a,b){
    //     return a.r - b.r
    //   })
    //   ;

    circles
      .each(function(d){
        d.r = getRadius(d);
        // d.r = Math.random();
      })
      .transition()
      .duration(function(d){
        if(d.r>3.7){
          return duration;
        }
        return 0;
      })
      .delay(function(d,i){
        if(d.r>3.7){
          return 0;
        }
        return d.r*duration;
      })
      .style("stroke-width",function(d){
        if(d.r>3.7){
          return .75
        }
      })
      .attr("r",function(d){
        return d.r;
      })
      .attr("stroke",function(d){
        if(d.r>3.7){
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
      d.r = diameterAdjust(31163 * Math.sqrt(d[yearSelected].total_pop/125000));
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

    function makeSlaveryLegend(){

      var slaveryLegend = slaveryContainer.select(".slavery-legend");
      var populationLegend = slaveryContainer.select(".population-legend");

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
        .style("color",function(d,i){
          if(i==0){
            return d3.rgb(colorGradient(d)).brighter([1.5]);
          }
          return colorGradient(d);
        })
        .html(function(d,i){
          if(i==0){
            return "0%"
          }
          return Math.round(d*100)+"%";
        })
        ;

      var popInterpolate = ["100","1K","50K","1M+"]

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
    function makePopulationLegend(){
      var populationLegend = populationContainer.select(".slavery-legend");
      var incarcerationLegend = populationContainer.select(".state-population-legend");

      var populationLegendItem = populationLegend.selectAll("div")
        .data(colorGradient.domain())
        .enter()
        .append("div")
        .attr("class","slavery-legend-item")
        ;

      populationLegendItem.append("div")
        .attr("class","slavery-legend-circle")
        .style("background-color",function(d){
          return colorGradient(d);
        })
        ;

      populationLegendItem.append("p")
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

      var popInterpolate = [100,250,500];

      incarcerationLegend.append("p")
        .attr("class","state-population-legend-text")
        .text("Lower Rate");

      var incarcerationLegendItem = incarcerationLegend.selectAll("div")
        .data([1000000,1000000,1000000,1000000])
        .enter()
        .append("div")
        .attr("class","state-population-legend-item")
        ;

      incarcerationLegendItem.append("div")
        .attr("class","state-legend-circle")
        .style("width",function(d,i){
          if(i==0){
            return "5px"
          }
          if(i==1){
            return "10px"
          }
          if(i==2){
            return "15px"
          }
          if(i==3){
            return "18px"
          }
          return 2*diameterAdjust(popScale(d))+"px";
        })
        .style("height",function(d,i){
          if(i==0){
            return "5px"
          }
          if(i==1){
            return "10px"
          }
          if(i==2){
            return "15px"
          }
          if(i==3){
            return "18px"
          }
          return 2*diameterAdjust(popScale(d))+"px";
        })
        ;

      incarcerationLegend.append("p")
        .attr("class","state-population-legend-text")
        .text("Higher Rate");

    }

    function makeIncarcerationLegend(){
      var incarcerationLegend = incarcerationContainer.select(".slavery-legend");

      var incarcerationLegendItem = incarcerationLegend.selectAll("div")
        .data(colorGradientJail.domain())
        .enter()
        .append("div")
        .attr("class","incarceration-legend-item")
        ;

      incarcerationLegendItem.append("div")
        .attr("class","slavery-legend-circle")
        .style("background-color",function(d,i){
          return colorGradientJail(d);
        })
        ;

      incarcerationLegendItem.append("p")
        .attr("class","slavery-legend-text")
        .style("color",function(d,i){
          if(i==0){
            return d3.rgb(colorGradientJail(d)).brighter([1.5]);
          }
          return colorGradientJail(d);
        })
        .html(function(d,i){
          if(i==0){
            return ">"+d;
          }
          return commaFormat(d);
        })
        ;

    }
    makeSlaveryLegend();
    makePopulationLegend();
    makeIncarcerationLegend();

  }
  function makeNavigation(){

      chapterItemes
        .on("click",function(){
          slaveryYear.text(yearSelected);
          var change = d3.select(this).text();
          var currentYear = +slaveryYear.text();
          var delta = Math.abs(currentYear - change)*10;

          function changeYear(){
            if(change<currentYear){
              currentYear = currentYear - 1;
            }
            else{
              currentYear = currentYear + 1;
            }

            slaveryYear
              .text(currentYear)
              .transition()
              .duration(25)
              .each("end",function(d){
                if(change!=currentYear){
                  changeYear();
                }
              })
              ;
          }
          changeYear();

          chapterItemes.classed("chapter-selected",function(d){
            if(d3.select(this).text()==change){
              return true;
            }
            return false;
          })

          yearSelected = +change;
          adjustCircles(delta);
        })
        ;
  }

  var colorGradientAdmissions = d3.scale.linear()
    .domain([20,40,50,60,80]).range(colors)
    .interpolate(d3.interpolateHcl)
    .clamp(true)
    ;

  var colorGradientJailDomain = [200,600,1000,2000,30000];

  var colorGradientJail = d3.scale.linear()
  //1990
    // .domain([100,350,500,700,800]).range(["#194abf","rgb(166, 40, 126)","rgb(255, 85, 0)","rgb(242,206,206)","rgb(255,255,0)"])
  //2014
    //.domain([250,600,800,1200,1500]).range(["#194abf","rgb(166, 40, 126)","rgb(255, 85, 0)","rgb(242,206,206)","rgb(255,255,0)"])
    .domain(colorGradientJailDomain).range(colors)
    .interpolate(d3.interpolateHcl)
    .clamp(true)
    ;

  makeLegends();
  makeNavigation();


  allPointsReMapped = allPointsReMapped.filter(function(d){
    return getRadius(d) > 0;
  })

  var populationMapContainer = svgPopulation.append("g")
    ;

  var incarcerationMapContainer = svgIncarceration.append("g")
    ;

  var slaveryMapContainer = svg.append("g")
    .attr("transform","translate("+margin.left+","+margin.top+")")
    ;

  var countyObject = {type:"GeometryCollection",geometries:us.objects.counties.geometries.filter(function(d){
    return d;
  })}

  var countyLocations = topojson.feature(us,countyObject).features;

  var object = {type:"GeometryCollection",geometries:us.objects.states.geometries.filter(function(d){
    return remove.indexOf(d.id) == -1;
  })}

  var usStates = topojson.feature(us,object).features;

  var incarcerationCounties = incarcerationMapContainer.append("g")
    .attr("transform","translate(-115,-15) scale(1.2)")
    .selectAll("path")
    .data(countyLocations)
    .enter()
    .append("path")
    .attr("d",d3.geo.path())
    .attr("class","population-map-county")
    .attr("fill",function(d){

      if(jailMap.has(+d.id)){
        var incarceration = jailMap.get(+d.id)["jail_"+yearIncarcerationSelected];
        if(incarceration != 0){
          return colorGradientJail(+incarceration);
        }
      }

      // if(admissionsMap.has(+d.id)){
      //   var incarceration = admissionsMap.get(+d.id)["ad_"+yearIncarcerationSelected];
      //   if(incarceration != 0){
      //     return colorGradientAdmissions(+incarceration);
      //   }
      // }
      return "#0a061b";
    })
    .style("stroke",function(d){
      if(jailMap.has(+d.id)){
        return "#0a061b"
      }
      // if(admissionsMap.has(+d.id)){
      // return "#0a061b"
      // }
      return "none";
    })
    .on("mouseover",function(d){
      // if(admissionsMap.has(+d.id)){
      //   var incarceration = admissionsMap.get(+d.id)["ad_"+yearIncarcerationSelected];
      //   console.log(incarceration);
      // }
    })
    ;

  var stateIncarcerationPaths = incarcerationMapContainer.append("g")
    .append("path")
    // .data(usStates)
    .datum(topojson.mesh(us, object, function(a, b) {
      return a !== b;
    }))
    .attr("transform","translate(-115,-15) scale(1.2)")
    .attr("d",d3.geo.path())
    .attr("class","state-incarceration-path")
    ;

  var populationCounties = populationMapContainer.append("g")
    .attr("transform","translate(-115,-15) scale(1.2)")
    .selectAll("path")
    .data(countyLocations)
    .enter()
    .append("path")
    .attr("d",d3.geo.path())
    .attr("class","population-map-county")
    .attr("fill",function(d){
      if(populationMap.has(+d.id)){
        var population = populationMap.get(+d.id)["pop_"+yearPopulationSelected];
        if(population != null){
          return colorGradient(+population);
        }
      }
      return "#0a061b";
    })
    .style("stroke",function(d){
      if(populationMap.has(+d.id)){
        return "#0a061b"
      }
      // if(admissionsMap.has(+d.id)){
      // return "#0a061b"
      // }
      return "none";
    })
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
      if(d.r>3.7){
        return .75
      }
      return null;
    })
    .attr("stroke",function(d){
      if(d.r>3.7){
        return "#0a061b";
      }
      return null;
    })
    .attr("fill",function(d){
      return getColor(d);
    })
    ;

  var colorGradientIncarceration = d3.scale.pow()
    .domain([50,600])
    .range([8,30])
    .exponent([4])
    .clamp(true)
    ;

  var extentIncar = d3.extent(incarcerationData,function(d){
    if (+d["inc_"+yearPopulationSelected]==0){
      return null
    };
    return +d["inc_"+yearPopulationSelected];
  })
  ;
  colorGradientIncarceration.domain(extentIncar)

  var fontScaleIncarceration = d3.scale.linear()
    .domain(extentIncar)
    .range([12,24])
    .clamp(true)
    ;

  var stateIncarcerationPaths = populationMapContainer.append("g")
    .append("path")
    // .data(usStates)
    .datum(topojson.mesh(us, object, function(a, b) {
      return a !== b;
    }))
    .attr("transform","translate(-115,-15) scale(1.2)")
    .attr("d",d3.geo.path())
    .attr("class","state-incarceration-path")
    ;

  var pathTwo = d3.geo.path()

  var incarcerationStates = usStates.filter(function(d){
    return d.id < 56 && remove.indexOf(d.id) == -1;
  })

  var incarcerationCirclesContainer = populationMapContainer.append("g")
    .attr("class","population-state-circle-container")
    .attr("transform","translate(-115,-15) scale(1.2)")
    ;

  var incarcerationCircles = incarcerationCirclesContainer
    .selectAll("circle")
    .data(incarcerationStates)
    .enter()
    .append("circle")
    .attr("class","incar-circle")
    .attr("transform", function(d) {
      return "translate(" + pathTwo.centroid(d) + ")";
    })
    .attr("r", function(d){
      if(incarcerationMap.has(+d.id)){
        var incarceration = incarcerationMap.get(+d.id)["inc_"+yearPopulationSelected];
        if(incarceration != ""){
          return colorGradientIncarceration(+incarceration);
        }
      }
      return 0;
    })
    ;

  var incarcerationTextContainer = populationMapContainer.append("g")
    .attr("class","population-state-text-container")
    .attr("transform","translate(-115,-15) scale(1.2)")
    ;

  var incarcerationText = incarcerationTextContainer
    .selectAll("text")
    .data(incarcerationStates)
    .enter()
    .append("text")
    .attr("class","incar-text")
    .attr("text-anchor","middle")
    .attr("dominant-baseline","middle")
    .attr("alignment-baseline","middle")
    .attr("transform", function(d) {
      return "translate(" + pathTwo.centroid(d) + ")";
    })
    .style("font-size",function(d){
      if(incarcerationMap.has(+d.id)){
        var incarceration = incarcerationMap.get(+d.id)["inc_"+yearPopulationSelected];
        if(incarceration != ""){
          return Math.round(fontScaleIncarceration(+incarceration))+"px";
        }
      }
      return 0;
    })
    .text(function(d){
      if(incarcerationMap.has(+d.id)){
        var incarceration = incarcerationMap.get(+d.id)["inc_"+yearPopulationSelected];
        if(incarceration != ""){
          return +incarceration;
        }
      }
      return 0;
    })
    ;

  function inside(point, vs) {
      // ray-casting algorithm based on
      // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

      var x = point[0], y = point[1];

      var inside = false;
      for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
          var xi = vs[i][0], yi = vs[i][1];
          var xj = vs[j][0], yj = vs[j][1];

          var intersect = ((yi > y) != (yj > y))
              && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
      }

      return inside;
  };

  var testArray;
  var restoredDataset = [];

  var slaveryToolTip = svg.append("g")
    .attr("class", "slavery-tooltip")

  slaveryToolTipText = slaveryToolTip.append("text")
    .attr("class", "slavery-tooltip-text")
    .attr("text-anchor","middle")
    .text("hi")
    ;

  var usPath = svg.append("g")
    .attr("class", "slavery-us-border")
    .append("path")
    .datum(topojson.feature(us, us.objects.land))
    .attr("d", d3.geo.path())
    .attr("transform","translate(-115,-15) scale(1.2)")
    .on("mousemove",function(d){
      if(uiSelected=="slavery"){
        var coor = d3.mouse(this);
        var x2 = coor[0].toFixed(2)*1.2-115;
        var y2 = coor[1].toFixed(2)*1.2-15;

        slaveryToolTip.attr("transform","translate("+x2+","+(+y2 - 75)+")")

        var totalSlaves = 0;
        var totalPeople = 0;

        statePaths.style("stroke",function(d){
          var x = x2/1.2 + 115/1.2;
          var y = y2/1.2 + 15/1.2;

          var box = d3.select(this).node().getBBox();
          var bb = {x1:box.x,x2:box.x+box.width,y1:box.y,y2:box.y+box.height};
          if( bb.x1 < x && bb.x2 > x && bb.y1 < y && bb.y2 > y) {
            return "white";
          }
          return null;
        })

        circles.style("opacity",function(d,i){
          var x1 = +d.x;
          var y1 = +d.y;
          var distance = Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
          if(distance<50){
            var totalPop = +d[yearSelected].total_pop;
            var slavePop = +d[yearSelected].slave_pop;
            totalPeople = totalPop+totalPeople;
            totalSlaves = slavePop+totalSlaves;
            return "1"
          }
          return ".5";
        })
        var slavePercent = totalSlaves/totalPeople;
        if(slavePercent > -1){
          slaveryToolTipText.html("Population is <tspan style='font-size:21px;'>"+Math.round(slavePercent*100)+"%</tspan> Slaves");
        } else{
          slaveryToolTipText.html("");
        }
      }
    })
    .on("mouseout",function(d){
      if(!slaveZoomed){
        statePaths.style("stroke",null);
      }
      circles.style("opacity",1);
      slaveryToolTipText.text("");
      ;
    })
    ;

  var statePaths = svg.append("g")
    .selectAll("path")
    .data(usStates)
    .enter()
    .append("path")
    .attr("transform","translate(-115,-15) scale(1.2)")
    .attr("d",d3.geo.path())
    .attr("class","state-path")
    ;

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

  function setupLayout(){

    contentContainerWidth = Math.min(650,viewportWidth*.75-162);
    heightPadding = (viewportHeight-contentContainerWidth)/2;
    var contentContainer = d3.select(".content-container");

    contentContainer
      .style("width",contentContainerWidth+"px")
      // .style("right","162px")
      ;

    slaveryContainer
      .datum("slavery")
      .style("width",contentContainerWidth/2+"px")
      .style("height",contentContainerWidth/2+"px")
      .style("top",(heightPadding)+"px")
      ;

    populationContainer
      .datum("population")
      .style("left",contentContainerWidth/2+"px")
      .style("width",contentContainerWidth/2+"px")
      .style("height",contentContainerWidth/2+"px")
      .style("top",(heightPadding)+"px")
      ;

    incarcerationContainer
      .datum("incarceration")
      .style("left",(contentContainerWidth-(contentContainerWidth/2))/2+"px")
      .style("top",(contentContainerWidth/2+heightPadding)+"px")
      .style("width",contentContainerWidth/2+"px")
      .style("height",contentContainerWidth/2+"px")
      ;

    uiBoxes.on("click",function(d){
      uiSelected = d;
      uiZoom(d);
      if(uiSelected=="slavery"){
        slaveryUnZoom();
      }
    })

  }

  var startLabels = d3.selectAll(".start-label");
  var uiBoxes = d3.selectAll(".ui-boxes")
  var yearPopElements = populationContainer.select(".year-row").selectAll(".year-row-year");
  var yearSlaveryElements = slaveryContainer.select(".year-row").selectAll(".year-row-year");
  var yearAdmissionsElements = populationContainer.select(".year-row").selectAll(".admissions-button");
  var yearTitlePopulation = populationContainer.select(".year-selected-population");
  var stateIncarcerationLegend = populationContainer.select(".incarceration-legend-container");

  var yearIncElements = incarcerationContainer.select(".year-row").selectAll(".year-row-year");

  function reduceLabels(hidden){
    startLabels
      .style("visibility",function(d){
        if(d3.select(this.parentNode).datum()==hidden){
          return "hidden";
        }
        return null;
      })
      .transition()
      .duration(500)
      .style("top","0px")
      .style("left","80px")
      .style("font-size","10px")
      ;

  }

  function showStateBubbles(state){

    var translate = {true:"ON",false:"OFF"};

    yearAdmissionsElements.classed("admissions-button-selected",function(d){
      if(d3.select(this).text() == translate[state]){
        return true;
      }
      return false;
    })

    incarcerationCirclesContainer.style("display",function(){
      if(state){
        return null;
      }
      return "none";
    })

    stateIncarcerationLegend.style("display",function(){
      if(state){
        return "block";
      }
      return null;
    });

    incarcerationTextContainer.style("display",function(){
      if(state){
        return null;
      }
      return "none";
    });
  }

  function setupToggles(){

    yearIncElements.on("click",function(d){
      var year = d3.select(this).text();
      yearIncarcerationSelected = +year;

      scaleNote.style("display",function(d){
        if(yearIncarcerationSelected==1980){
          return "block";
        }
        return null;
      })

      yearIncElements.classed("year-row-selected",function(d){
        if(d3.select(this).text()==year){
          return true;
        }
        return false;
      });

      var domains = {2000:colorGradientJailDomain
          ,2014:colorGradientJailDomain
          ,1980:colorGradientJailDomain//[75,200,500,600,700]
      };

      colorGradientJail.domain(domains[yearIncarcerationSelected]);

      var incarcerationLegend = incarcerationContainer.select(".slavery-legend");

      incarcerationLegend.selectAll("div").remove();

      var incarcerationLegendItem = incarcerationLegend.selectAll("div")
        .data(colorGradientJail.domain())
        .enter()
        .append("div")
        .attr("class","incarceration-legend-item")
        ;

      incarcerationLegendItem.append("div")
        .attr("class","slavery-legend-circle")
        .style("background-color",function(d,i){
          return colorGradientJail(d);
        })
        ;

      incarcerationLegendItem.append("p")
        .attr("class","slavery-legend-text")
        .style("color",function(d,i){
          if(i==0){
            return d3.rgb(colorGradientJail(d)).brighter([1.5]);
          }
          return colorGradientJail(d);
        })
        .html(function(d,i){
          if(i==0){
            return ">"+d;
          }
          return commaFormat(d);
        })
        ;

      incarcerationCounties
        .transition()
        .duration(750)
        .attr("fill",function(d){
          if(jailMap.has(+d.id)){
            var incarceration = jailMap.get(+d.id)["jail_"+yearIncarcerationSelected];
            if(incarceration != 0){
              return colorGradientJail(+incarceration);
            }
          }
          return "#0a061b";
        })
        ;

    })

    yearAdmissionsElements.on("click",function(d){

      var buttonText = d3.select(this).text();
      var buttonTextState;
      if(buttonText=="ON"){
        buttonTextState = true;
      }
      else{
        buttonTextState = false;
      }
      if(yearBubblesVisible != buttonTextState){
        yearBubblesVisible=buttonTextState;
        showStateBubbles(yearBubblesVisible);
      }
    })

    yearSlaveryElements.on("click",function(){
        var year = d3.select(this).text();
        yearSelected = +year;

        // chapterItemes.classed("chapter-selected",function(d){
        //   if(d3.select(this).text()==change){
        //     return true;
        //   }
        //   return false;
        // })
        yearSlaveryElements.classed("year-row-selected",function(d){
          if(d3.select(this).text()==year){
            return true;
          }
          return false;
        });
        adjustCircles(1000);
      })
      ;

    yearPopElements
      .on("click",function(){
        var year = d3.select(this).text();

        yearPopulationSelected = +year;
        yearTitlePopulation.text(yearPopulationSelected);
        populationCounties
          .transition()
          .duration(750)
          .attr("fill",function(d){
            if(populationMap.has(+d.id)){
              var population = populationMap.get(+d.id)["pop_"+yearPopulationSelected];
              if(population != null){
                return colorGradient(+population);
              }
            }
            return "#0a061b";
          })
          ;

        incarcerationText
          .transition()
          .duration(1000)
          .style("font-size",function(d){
            if(incarcerationMap.has(+d.id)){
              var incarceration = incarcerationMap.get(+d.id)["inc_"+yearPopulationSelected];
              if(incarceration != ""){
                return Math.round(fontScaleIncarceration(+incarceration))+"px";
              }
            }
            return 0;
          })
          .text(function(d){
            if(incarcerationMap.has(+d.id)){
              var incarceration = incarcerationMap.get(+d.id)["inc_"+yearPopulationSelected];
              if(incarceration != ""){
                return +incarceration;
              }
            }
            return 0;
          })
          ;

        incarcerationCircles
          .transition()
          .duration(1000)
          .attr("r", function(d){
            if(incarcerationMap.has(+d.id)){
              var incarceration = incarcerationMap.get(+d.id)["inc_"+yearPopulationSelected];
              if(incarceration != ""){
                return colorGradientIncarceration(+incarceration);
              }
            }
            return 0;
          })
          ;

        yearPopElements.classed("year-row-selected",function(d){
          if(d3.select(this).text()==year){
            return true;
          }
          return false;
        });

      })
      ;
  }

  function unZoom(){

    startLabels
      .style("visibility",null)
      .style("top",null)
      .style("left",null)
      .style("font-size",null)
      ;

    uiElements
      .transition()
      .duration(500)
      .style("opacity",0)
      ;

    uiBoxes.select(".map-wrapper").transition().duration(500).style("top","0px");

    uiBoxes
      .transition()
      .duration(1000)
      .style("width",contentContainerWidth/2+"px")
      .style("height",contentContainerWidth/2+"px")
      .style("top",function(d){
        if(d=="incarceration"){
          return (contentContainerWidth/2+heightPadding)+"px"
        }
        return (heightPadding)+"px";
      })
      .style("left",function(d){
        if(d=="incarceration"){
          return (contentContainerWidth-(contentContainerWidth/2))/2+"px";
        }
        if(d=="slavery"){
          return null;
        }
        return contentContainerWidth/2+"px";
      })
      ;

  }

  function uiZoom(chart){

    reduceLabels(chart);

    uiElements
      .transition()
      .duration(500)
      .style("opacity",function(d){
        if(d3.select(this.parentNode).datum()==chart){
          return 1;
        }
        return 0;
      })
      ;

    uiBoxes.select(".map-wrapper").transition().duration(500).style("top",function(d){
      if(d3.select(this.parentNode).datum()==chart){
        return "50px"
      }
      return "0px";
    });

    var iterate = 0;

    uiBoxes
      .transition()
      .duration(1000)
      .style("width",function(d){
        if(d==chart){
          return "550px";
        }
        return "70px"
      })
      .style("height",function(d){
        if(d==chart){
          return "550px";
        }
        return "70px"
      })
      .style("top",function(d){
        if(d==chart){
          return "0px"
        }
        iterate = iterate + 90;
        return viewportHeight-iterate+"px"
      })
      .style("left",function(d){
        if(d==chart){
          return (contentContainerWidth-550)/2+"px";
        }
        return "-100px";
      })
      ;

  }

  function slaveryUnZoom(){
    slaveZoomed = false;

    svg.transition().duration(750)
      .attr("viewBox","350 0 580 580")
      ;

    statePaths
      .style("stroke", null)
      .style("stroke-width",null)
      ;
  }

  function slaveryZoom(){

    slaveZoomed = true;

    svg.transition().duration(750)
      .attr("viewBox","350 200 400 580")
      ;

    statePaths
      .style("stroke",function(d){
        if(+d.id==22){
          return "white";
        }
        return null;
      })
      .style("stroke-width",function(d){
        if(+d.id==22){
          return "2px";
        }
        return null;
      })
      ;
  }

  setupLayout();
  setupToggles();
  showStateBubbles(yearBubblesVisible);

  var moveNavigator = new ScrollMagic.Scene({
      // triggerElement: ".third-chart-wrapper",
      triggerElement: ".slavery-trigger",
      triggerHook:1,
      offset: 0,
      duration:500
    })
    // .addIndicators({name: "slavery zoom"}) // add indicators (requires plugin)
    .addTo(controller)
    .on("enter",function(e){
      if(e.target.controller().info("scrollDirection") == "REVERSE"){
      }
      else{
        uiZoom("slavery");
      }
      ;
    })
    .on("leave",function(e){
      if(e.target.controller().info("scrollDirection") == "FORWARD"){
        navigatorElement.transition().duration(1000).style("right","0px");
      }
      else{
        navigatorElement.transition().duration(1000).style("right","-162px");
        unZoom();
      }
    })
    ;

  var zoomSlavery = new ScrollMagic.Scene({
      // triggerElement: ".third-chart-wrapper",
      triggerElement: ".zoom-trigger",
      triggerHook:1,
      offset: 0,
      duration:300
    })
    // .addIndicators({name: "zoom"}) // add indicators (requires plugin)
    .addTo(controller)
    .on("enter",function(e){
      if(e.target.controller().info("scrollDirection") == "REVERSE"){
      }
      else{
        slaveryZoom();
      }
      ;
    })
    .on("leave",function(e){
      if(e.target.controller().info("scrollDirection") == "FORWARD"){
        uiZoom("population");
      }
      else{
        slaveryUnZoom();
      }
    })
    ;

  var zoomPopulation = new ScrollMagic.Scene({
      // triggerElement: ".third-chart-wrapper",
      triggerElement: ".black-pop-trigger",
      triggerHook:1,
      offset: 1,
      duration:500
    })
    // .addIndicators({name: "population"}) // add indicators (requires plugin)
    .addTo(controller)
    .on("enter",function(e){
      if(e.target.controller().info("scrollDirection") == "REVERSE"){
      }
      else{
        // slaveryUnZoom();
      }
      ;
    })
    .on("leave",function(e){
      if(e.target.controller().info("scrollDirection") == "FORWARD"){
        yearBubblesVisible = true;
        showStateBubbles(yearBubblesVisible);
      }
      else{
        yearBubblesVisible = false;
        showStateBubbles(yearBubblesVisible);
      }
    })
    ;

  var zoomIncarceration = new ScrollMagic.Scene({
      // triggerElement: ".third-chart-wrapper",
      triggerElement: ".incar-trigger",
      triggerHook:1,
      offset: 0,
      duration:100
    })
    // .addIndicators({name: "incarceration"}) // add indicators (requires plugin)
    .addTo(controller)
    .on("enter",function(e){
      if(e.target.controller().info("scrollDirection") == "REVERSE"){
      }
      else{
        yearBubblesVisible = false;
        showStateBubbles(yearBubblesVisible);
        uiZoom("incarceration");
      }
      ;
    })
    .on("leave",function(e){
      if(e.target.controller().info("scrollDirection") == "FORWARD"){
      }
      else{
      }
    })
    ;

//admissions.csv
});
//admissions.csv
});
//incarceration.csv
});
//population.csv
});
//us.json
});
//line_paths.csv
});
//allpoints.csv
});
