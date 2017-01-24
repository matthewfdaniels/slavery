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
var remove = [2,4,6,8,15,20,27,30,31,32,35,38,40,46,49,56,72,78,16,41,53];
var scaleNote = d3.select(".scale-note");
var navigatorElement = d3.select(".navigator");
var toolTipText = "slaves";
var controller = new ScrollMagic.Controller();
var selectableYears = d3.selectAll(".year-row-year");
var rightCol = d3.select(".right-col");
var leftCol = d3.select(".left-col")
var mapWidth = Math.min(viewportWidth*.75 - 370,600);
console.log(viewportWidth*.75 - 400);
var laHighlight = rightCol.select(".zoom-highlight")
var states = [
  ["Maine","ME",1,"Northeast",23],
  ["Vermont","VT",2,"Northeast",50],
  ["New Hampshire","NH",3,"Northeast",33],
  ["Rhode Island","RI",4,"Northeast",44],
  ["Massachusetts","MA",5,"Northeast",25],
  ["Connecticut","CT",6,"Northeast",9],
  ["Delaware","DE",7,"Northeast",10],
  ["New Jersey","NJ",8,"Northeast",34],
  ["New York","NY",9,"Northeast",36],
  ["Pennsylvania","PA",10,"Northeast",42],
  ["District of Columbia","DC",11,"Northeast",11],
  ["Maryland","MD",12,"Northeast",24],
  ["Virginia","VA",13,"South",51],
  ["North Carolina","NC",14,"South",37],
  ["South Carolina","SC",15,"South",45],
  ["Georgia","GA",16,"South",13],
  ["Alabama","AL",17,"South",1],
  ["Mississippi","MS",18,"South",28],
  ["Louisiana","LA",19,"South",22],
  ["Arkansas","AR",20,"South",5],
  ["Tennessee","TN",21,"South",47],
  ["Kentucky","KY",22,"South",21],
  ["West Virginia","WV",23,"South",54],
  ["Oklahoma","OK",24,"Midwest",40],
  ["Colorado","CO",25,"West",8],
  ["Utah","UT",26,"West",49],
  ["Idaho","ID",27,"West",16],
  ["Wyoming","WY",28,"West",56],
  ["Montana","MT",29,"West",30],
  ["North Dakota","ND",30,"Midwest",38],
  ["South Dakota","SD",31,"Midwest",46],
  ["Nebraska","NE",32,"Midwest",31],
  ["Kansas","KS",33,"Midwest",20],
  ["Iowa","IA",34,"Midwest",19],
  ["Minnesota","MN",35,"Midwest",27],
  ["Wisconsin","WI",36,"Midwest",55],
  ["Indiana","IN",37,"Midwest",18],
  ["Missouri","MO",38,"Midwest",29],
  ["Ohio","OH",39,"Midwest",39],
  ["Michigan","MI",40,"Midwest",26],
  ["Illinois","IL",41,"Midwest",17],
  ["Florida","FL",42,"South",12],
  ["California","CA",43,"West",6],
  ["Nevada","NV",44,"West",32],
  ["Texas","TX",45,"South",48],
  ["Arizona","AZ",46,"West",4],
  ["New Mexico","NM",47,"West",35],
  ["Alaska","AK",48,"West",2],
  ["Washington","WA",49,"West",53],
  ["Oregon","OR",50,"West",41],
  ["Hawaii","HI",51,"West",15],
  ]
  ;

var fixedDiv = d3.select(".circle-fix")
  .select("svg")
  .attr("width",viewportWidth)
  .attr("height",viewportHeight)
  .select("g");

d3.csv("all_points_new_2.csv", function(error, allPoints) {
d3.csv("allpoints.csv", function(error, allPointsOld) {
  d3.json("us.json", function(error, us) {
    // d3.csv("line_paths.csv", function(error, borderPaths) {
      d3.csv("population.csv", function(error, populationData) {
        d3.csv("incarceration_2.csv", function(error, incarcerationData) {
          d3.csv("admissions.csv", function(error, admissionsData) {
            d3.csv("jail.csv", function(error, jailData) {
              d3.csv("flag.csv", function(error, flagData) {

  leftCol.style("visibility","visible");

  var uiElements = leftCol.selectAll(".ui-elements");
  var uiBoxes = leftCol.selectAll(".ui-boxes")

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

  var statesMap = d3.map(states,function(d){
    return d[4];
  })

  var jailMap = d3.map(jailData,function(d){
    return +d.county;
  })

  var xExtent = d3.extent(allPoints, function(d) { return +d.x });
  var yExtent = d3.extent(allPoints, function(d) { return +d.y });

  allPoints = allPoints.filter(function(d){
    return d;
    // var sectionOne = false;
    // if(+d.x < -112312 && +d.y > -61240){
    //   sectionOne = true;
    // }
    // return +d.total_1860 > 0 && +d.x > -519447 && !sectionOne;
  })

  // console.log(allPoints);

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
  var diameterAdjust = d3.scale.linear().domain([1247,37395]).range([.5,3.7]).clamp(false);

  // var colors = ["#194abf","rgb(166, 40, 126)","rgb(255, 85, 0)","rgb(242,206,206)","rgb(255,255,0)"]
  var colors = ["#220e79","rgb(166, 40, 126)","rgb(255, 85, 0)","rgb(242,206,206)","rgb(255,255,0)"]
//220e79
//0a061b
  var colorGradientDomain = [.000000000001,.2375,.475,.7125,.95];

  var colorGradient = d3.scale.linear().domain(colorGradientDomain).range(colors)
    .interpolate(d3.interpolateHcl)
    .clamp(true)
    ;

  var colorGradientJailDomain = [200,400,700,4000,5000];
  var colorGradientJail = d3.scale.linear()
  //1990
    // .domain([100,350,500,700,800]).range(["#194abf","rgb(166, 40, 126)","rgb(255, 85, 0)","rgb(242,206,206)","rgb(255,255,0)"])
  //2014
    //.domain([250,600,800,1200,1500]).range(["#194abf","rgb(166, 40, 126)","rgb(255, 85, 0)","rgb(242,206,206)","rgb(255,255,0)"])
    .domain(colorGradientJailDomain).range(colors)
    .interpolate(d3.interpolateHcl)
    .clamp(true)
    ;

  var allPointsReMapped = [];
  for (var point in allPoints){
    var d = allPoints[point];
    var xReMap = xMapScale(+d.x);
    var yReMap = yMapScale(+d.y);

    allPointsReMapped.push({
      x:xReMap,y:yReMap,
      point_id:d.point_id,
      "1790":{
        total_pop:d.slaves_1790,
        num_pop:d.slaves_1790,
        total_pop_two:+d.total_1790
      },
      "1860":{
        total_pop:+d.slaves_1860,
        num_pop: +d.slaves_1860,
        total_pop_two:+d.total_1860
      },
      "pop_1860":{
        total_pop:+d.slaves_1860 + +d.free_blacks_1860,
        num_pop: +d.slaves_1860 + +d.free_blacks_1860,
        total_pop_two:+d.total_1860
      },
      "1830":{
        total_pop:d.slaves_1830,
        num_pop:d.slaves_1830,
        total_pop_two:+d.total_1830
      },
      "pop_2010":{
        total_pop:+d.black_2010,
        num_pop:+d.black_2010,
        total_pop_two:+d.total_2010
      },
      "pop_1910":{
        total_pop:+d.black_1910,
        num_pop:+d.black_1910,
        total_pop_two:+d.total_1910
      },
      "pop_1970":{
        total_pop:+d.black_1970,
        num_pop:+d.black_1970,
        total_pop_two:+d.total_1970
      },
      "jail_2010":{
        total_pop:+d.black_2010,
        num_pop:+d.jail_2010*100000,
        total_pop_two:+d.total_2010
      },
      "jail_2014":{
        total_pop:+d.black_2014,
        num_pop:+d.jail_2014,
        total_pop_two:+d.total_2014
      },
      "jail_1000":{
        total_pop:+d.black_2010,
        num_pop:+d.jail_black_2010,
        total_pop_two:+d.total_1860
      }
    });
  }


  var slaveryContainer = leftCol.select(".slavery-container");
  var populationLegendContainer = slaveryContainer.select(".population-legend-container");
  var populationLegendTitle = populationLegendContainer.select(".slavery-legend-title")

  var slaveryLegendContainer = slaveryContainer.select(".slavery-legend-container");
  var slaveryLegendTop = slaveryLegendContainer.select(".population-legend-top");
  var slaveryLegendBottom = slaveryLegendContainer.select(".jail-legend-bottom");
  var slaveryLegendTitle = slaveryLegendContainer.select(".slavery-legend-title")

  var mapWrapper = slaveryContainer.select(".map-wrapper");

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
    .attr("height", 600)
    ;

  // svg.attr("clip-path", "url(#clip)")

  // var svgPopulation = populationWrapper.select("svg")
  //   .attr("width","100%")
  //   .attr("height","100%")
  //   .attr("viewBox","350 0 580 580")
  //   ;

  // var svgIncarceration = incarcerationWrapper.select("svg")
  //   .attr("width","100%")
  //   .attr("height","100%")
  //   .attr("viewBox","350 0 580 580")
  //   ;

  function adjustCircles(duration){

    circles
      .each(function(d){
        d.r = getRadius(d);
      })
      ;

    circles
      .sort(function(a,b){
        return a.r - b.r
      })
      ;

    circles
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
    // else if (+d[yearSelected].total_pop > 122791.41) {
    //   d.r = diameterAdjust(31163 * Math.sqrt(d[yearSelected].total_pop/125000));
    // }
    else {
      d.r = diameterAdjust(popScale(d[yearSelected].total_pop));
    }
    return d.r;
  }

  function getColor(d){

    var totalPop = d[yearSelected].total_pop_two;
    var numeratorPop = d[yearSelected].num_pop;
    if(totalPop == ""){
      totalPop = 0;
    }
    if(numeratorPop == ""){
      numeratorPop = 0;
    }
    if(totalPop == 0){
      return null;
    }
    var color = colorGradient(+numeratorPop/+totalPop);
    return color;
  }

  function makeLegends(){

    function makeSlaveryLegend(){

      var slaveryLegend = slaveryLegendContainer.select(".slavery-legend");
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
      // var populationLegend = populationContainer.select(".slavery-legend");
      var incarcerationLegend = stateIncarcerationLegend.select(".state-population-legend");
      //
      // var populationLegendItem = populationLegend.selectAll("div")
      //   .data(colorGradient.domain())
      //   .enter()
      //   .append("div")
      //   .attr("class","slavery-legend-item")
      //   ;
      //
      // populationLegendItem.append("div")
      //   .attr("class","slavery-legend-circle")
      //   .style("background-color",function(d){
      //     return colorGradient(d);
      //   })
      //   ;
      //
      // populationLegendItem.append("p")
      //   .attr("class","slavery-legend-text")
      //   .style("color",function(d){
      //     return colorGradient(d);
      //   })
      //   .html(function(d,i){
      //     if(i==0){
      //       return "0%"
      //     }
      //     return Math.round(d*100)+"%";
      //   })
      //   ;
      //
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
      var incarcerationLegend = slaveryLegendContainer.select(".jail-legend");

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
            return "< 100";
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

  //var colorGradientJailDomain = [200,600,1000,2000,30000];

  // var colorGradientJail = d3.scale.linear()
  // //1990
  //   // .domain([100,350,500,700,800]).range(["#194abf","rgb(166, 40, 126)","rgb(255, 85, 0)","rgb(242,206,206)","rgb(255,255,0)"])
  // //2014
  //   //.domain([250,600,800,1200,1500]).range(["#194abf","rgb(166, 40, 126)","rgb(255, 85, 0)","rgb(242,206,206)","rgb(255,255,0)"])
  //   .domain(colorGradientJailDomain).range(colors)
  //   .interpolate(d3.interpolateHcl)
  //   .clamp(true)
  //   ;

  makeNavigation();

  function setupLayout(){

    contentContainerWidth = Math.min(mapWidth,viewportWidth*.75-162);
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
      // .style("top",(heightPadding)+"px")
      ;

    // populationContainer
    //   .datum("population")
    //   .style("left",contentContainerWidth/2+"px")
    //   .style("width",contentContainerWidth/2+"px")
    //   .style("height",contentContainerWidth/2+"px")
    //   .style("top",(heightPadding)+"px")
    //   ;
    //
    // incarcerationContainer
    //   .datum("incarceration")
    //   .style("left",(contentContainerWidth-(contentContainerWidth/2))/2+"px")
    //   .style("top",(contentContainerWidth/2+heightPadding)+"px")
    //   .style("width",contentContainerWidth/2+"px")
    //   .style("height",contentContainerWidth/2+"px")
    //   ;

    // uiBoxes.on("click",function(d){
    //   // uiSelected = d;
    //   // uiZoom(d);
    //   // if(uiSelected=="slavery"){
    //   //   slaveryUnZoom();
    //   // }
    // })

  }

  setupLayout();
  var object = {type:"GeometryCollection",geometries:us.objects.states.geometries.filter(function(d){
    return remove.indexOf(d.id) == -1;
  })}


  var objectNoHawaii = {type:"GeometryCollection",geometries:us.objects.states.geometries.filter(function(d){
    return [15,2].indexOf(d.id) == -1;
  })}

  var usStates = topojson.feature(us,objectNoHawaii).features;
  var usOutline = topojson.feature(us,objectNoHawaii).features;

  // var populationMapContainer = svgPopulation.append("g")
  //   ;
  //
  // var incarcerationMapContainer = svgIncarceration.append("g")
  //   ;

  var slaveryMapContainer = svg.append("g")
    .attr("transform","translate("+margin.left+","+margin.top+")")
    ;

  var countyObject = {type:"GeometryCollection",geometries:us.objects.counties.geometries.filter(function(d){
    return d;
  })}

  var countyLocations = topojson.feature(us,countyObject).features;

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
    ;

  var statePaths = svg.append("g")
    .selectAll("path")
    .data(usStates)
    .enter()
    .append("path")
    .attr("transform","translate(-115,-15) scale(1.2)")
    .attr("d",d3.geo.path())
    .attr("class",function(d){
      if(remove.indexOf(+d.id) == -1){
        // console.log(d.id);
        return "state-path bubble-state-path";
      }
      return "state-path";
    })
    ;

  var prisonRateContainer = svg.append("g")
    .attr("transform","translate("+margin.left+","+margin.top+")")
    ;

  adjustCircles(1000)

  var colorGradientIncarceration = d3.scale.pow()
    .domain([50,600])
    .range([7,29])
    .exponent([3])
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

  var fontScaleIncarceration = d3.scale.pow()
    .domain(extentIncar)
    .range([14,33])
    .exponent([3])
    .clamp(true)
    ;

  var pathTwo = d3.geo.path()

  var incarcerationStates = usStates.filter(function(d){
    return d.id < 56 && remove.indexOf(d.id) == -1;
  })

  var incarcerationCirclesContainer = prisonRateContainer.append("g")
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

  var incarcerationTextContainer = prisonRateContainer.append("g")
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
      if(+d.id == 10 && yearPopulationSelected == 2010){
        return "translate(" +(pathTwo.centroid(d)[0]+15)+","+pathTwo.centroid(d)[1]+ ")";
      }
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
    .attr("y",5)
    .text("")
    ;

  var mouseMoveCircleG = svg.append("g")
    .attr("class","mouse-move-circle")

  var mouseMoveCircle = mouseMoveCircleG
    .append("circle")
    .attr("r",25)
    ;

  var stateAbv = d3.selectAll(".state-abv");

  var usPath = svg.append("g")
    .attr("class", "slavery-us-border")
    .append("path")
    .datum(topojson.mesh(us, objectNoHawaii, function(a, b) {
      return a == b;
    }))
    //.datum(topojson.feature(us, us.objects.land))
    .attr("d", d3.geo.path())
    .attr("transform","translate(-115,-15) scale(1.2)")
    .on("mousemove",function(d){
        var coor = d3.mouse(this);
        var x2 = coor[0].toFixed(2)*1.2-115;
        var y2 = coor[1].toFixed(2)*1.2-15;
        mouseMoveCircle.attr("cx",x2).attr("cy",y2);
        slaveryToolTip.attr("transform","translate("+(x2 - 110)+","+(+y2)+")")
        var totalSlaves = 0;
        var totalPeople = 0;

        statePaths.classed("hover-highlight",function(d){
          var x = x2/1.2 + 115/1.2;
          var y = y2/1.2 + 15/1.2;

          var box = d3.select(this).node().getBBox();
          var bb = {x1:box.x,x2:box.x+box.width,y1:box.y,y2:box.y+box.height};
          if( bb.x1 < x && bb.x2 > x && bb.y1 < y && bb.y2 > y) {
            return true;
          }
          return false;
        })

        circles.each(function(d,i){
          var x1 = +d.x;
          var y1 = +d.y;
          var distance = Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
          if(distance<50){
            var totalPop = +d[yearSelected].total_pop_two;
            var slavePop = +d[yearSelected].num_pop;
            totalPeople = totalPop+totalPeople;
            totalSlaves = slavePop+totalSlaves;
          }
        })
        var slavePercent = totalSlaves/totalPeople;
        if(x2<450){
          slaveryToolTipText.attr("x",220)
        }
        else{
          slaveryToolTipText.attr("x",null)
        }

        if(yearSelected == "jail_2010"){
          if(slavePercent > -1){
            slaveryToolTipText.html("Jail Inmate Rate is <tspan style='font-size:21px;'>"+Math.round(slavePercent)+"</tspan> ");
          } else{
            slaveryToolTipText.html("");
          }
        }
        else if(slavePercent > -1){
          slaveryToolTipText.html("Population is <tspan style='font-size:21px;'>"+Math.round(slavePercent*100)+"%</tspan> "+toolTipText);
        }
        else{
          slaveryToolTipText.html("");
        }
    })
    .on("mouseenter",function(d){
      stateAbv.style("opacity",1);
      mouseMoveCircleG.style("opacity",1);
    })
    .on("mouseout",function(d){
      stateAbv.style("opacity",null);
      if(!slaveZoomed){
        statePaths.classed("hover-highlight",false);
      }
      slaveryToolTipText.text("");
      mouseMoveCircleG.style("opacity",null);
      ;
    })
    ;

  var paths = svg.append("g").append("path")
    .datum(topojson.mesh(us, object, function(a, b) {
      return a !== b;
    }))
    .attr("class","inter-state-paths")
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

  var startLabels = d3.selectAll(".start-label");

  // var yearPopElements = populationContainer.select(".year-row").selectAll(".year-row-year");

  var populationSelector = d3.select(".population-selector");
  var yearPopElements = populationSelector.select(".year-row").selectAll(".year-row-year");

  var fadeOutElements = d3.selectAll(".fade-out-elements");
  var slaverySelector = d3.select(".slavery-selector");
  var yearSlaveryElements = slaverySelector.select(".year-row").selectAll(".year-row-year");
  var statePrisonSelector = d3.select(".admissions-container");
  var yearAdmissionsElements = statePrisonSelector.selectAll(".admissions-button");
  var yearTitlePopulation = d3.select(".year-selected-population");
  var stateIncarcerationLegend = d3.select(".incarceration-legend-container");
  var jailSelector = d3.select(".jail-selector");
  var yearIncElements = jailSelector.select(".year-row").selectAll(".year-row-year");

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
    if(state){

      incarcerationText
        .html(function(d){
          if(incarcerationMap.has(+d.id)){
            var incarceration = incarcerationMap.get(+d.id)["inc_"+state];
            if(incarceration != ""){
              var abv = ""
              if(statesMap.has(+d.id)){
                abv = statesMap.get(+d.id)[1];
              }
              return +incarceration//+"<tspan class='state-abv' dx='0' dy='12' style='font-size:9px;'>"+abv+"</tspan>";
            }
          }
          return 0;
        })
        .transition()
        .duration(1000)
        .attr("transform", function(d) {
          if(+d.id == 10 && state == 2010){
            return "translate(" +(pathTwo.centroid(d)[0])+","+pathTwo.centroid(d)[1]+ ")";
          }
          return "translate(" + pathTwo.centroid(d) + ")";
        })
        .style("font-size",function(d){
          if(incarcerationMap.has(+d.id)){
            var incarceration = incarcerationMap.get(+d.id)["inc_"+state];
            if(incarceration != ""){
              return Math.round(fontScaleIncarceration(+incarceration))+"px";
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
            var incarceration = incarcerationMap.get(+d.id)["inc_"+state];
            if(incarceration != ""){
              return colorGradientIncarceration(+incarceration);
            }
          }
          return 0;
        })
        ;
    }

    incarcerationCirclesContainer.style("display",function(){
      if(!state){
        return "none";
      }
      return null;
    })



    incarcerationTextContainer.style("display",function(){
      if(state){
        return null;
      }
      return "none";
    })
    ;
  }

  function createScatter(){

    var xScale = d3.scale.pow().domain([100,2000]).range([350,width]).exponent(.5).clamp(true);
    var yScale = d3.scale.pow().domain([0,.7]).range([height-50,0]).exponent(.4).clamp(true);

    circles
      .style("opacity",0)

    circles
      .filter(function(d){
        return (d["1860"].num_pop)/(d["1860"].total_pop_two)>0
      })
      .style("opacity",1)
      .transition()
      .duration(function(d){
        return 1000;
      })
      .delay(function(d,i){
        var yPosition = (d["1860"].num_pop)/(d["1860"].total_pop_two)
        if(yPosition > 0){
          return 10000+(d["1860"].num_pop)/(d["1860"].total_pop_two)*10000
        }
        return 10000*Math.random();
      })
      .attr("cx",function(d){
        var xPosition = xScale((d.jail_2010.num_pop)/(d.jail_2010.total_pop_two))
        if(xPosition>0){
          return xPosition.toFixed(2);
        }
        return xScale(0);
      })
      .attr("cy",function(d){
        var yPosition = yScale((d["1860"].num_pop)/(d["1860"].total_pop_two))
        //if(yPosition > 0){
          return yPosition.toFixed(2);
        // }
        // return d.y.toFixed(2);
      })
      ;
  }

  function setupToggles(){

    startLabels.style("opacity",1);

    yearIncElements.on("click",function(d){

      populationLegendTitle.text("Black Population")
      colorGradient.domain(colorGradientJailDomain);
      selectableYears.classed("year-row-selected",false);
      d3.select(this).classed("year-row-selected",true);
      var year = d3.select(this).text();
      yearIncarcerationSelected = +year;
      yearSelected = "jail_".concat(year);
      adjustCircles(1000);
      var text = "U.S. Jail Rate in "+year;
      startLabelChange(text);

      slaveryLegendTop.style("opacity",0)
      slaveryLegendBottom.transition().duration(1000).delay(1000).style("opacity",1).style("top","0px");

    })

    yearAdmissionsElements.on("click",function(d){

      // toolTipText = "Black";

      var previous = yearBubblesVisible;
      yearAdmissionsElements.classed("admissions-button-selected",false);
      d3.select(this).classed("admissions-button-selected",true);
      var buttonText = d3.select(this).text();
      if(buttonText == "OFF"){
        svg.classed("bubbles-set",false);
        // console.log("im off right now");
        buttonText = false;
      }
      else{
        svg.classed("bubbles-set",true);
      }
      if(yearBubblesVisible != buttonText){
        yearBubblesVisible=buttonText;
        // console.log(yearBubblesVisible);
        showStateBubbles(yearBubblesVisible);
      }
      if(previous == false || yearBubblesVisible == false){
        stateIncarcerationLegend
          .style("top",function(){
            if(!yearBubblesVisible){
              return "40px";
            }
            return "20px";
          })
          .style("opacity",function(){
            if(yearBubblesVisible){
              return 0;
            }
            return 1;
          })
          .transition()
          .duration(700)
          .style("top",function(){
            if(yearBubblesVisible){
              return "40px";
            }
            return "20px";
          })
          .style("opacity",function(){
            if(yearBubblesVisible){
              return 1;
            }
            return 0;
          })
          ;
      }
      stateAbv = d3.selectAll(".state-abv")
    });

    yearSlaveryElements.on("click",function(){

        toolTipText = "slaves";

        selectableYears.classed("year-row-selected",false);
        d3.select(this).classed("year-row-selected",true);

        populationLegendTitle.text("Slave Population")
        slaveryLegendTitle.text("Slave Population as % of Total")

        colorGradient.domain(colorGradientDomain);

        var year = d3.select(this).text();
        yearSelected = +year;

        yearSlaveryElements.classed("year-row-selected",function(d){
          if(d3.select(this).text()==year){
            return true;
          }
          return false;
        });
        adjustCircles(1000);
        var text = "U.S. Slave Pop. in "+year;
        startLabelChange(text);
      })
      ;

    yearPopElements.on("click",function(){

        toolTipText = "Black";

        selectableYears.classed("year-row-selected",false);
        d3.select(this).classed("year-row-selected",true);
        populationLegendTitle.text("Black Population")
        slaveryLegendTitle.text("Black Population as % of Total")

        colorGradient.domain(colorGradientDomain);

        var year = d3.select(this).text();
        yearPopulationSelected = +year;
        // console.log(year);
        yearSelected = "pop_".concat(year);
        adjustCircles(1000);
        var text = "U.S. Black Pop. in "+year;
        startLabelChange(text);
      })
      ;
  }

  function startLabelChange(text){
    startLabels
      .text(text)
      .style("opacity",0)
      .style("top","570px")
      .transition()
      .duration(750)
      .delay(750)
      .style("top","610px")
      .style("opacity",1)
      ;
  }

  // function unZoom(){
  //
  //   startLabels
  //     .style("visibility",null)
  //     .style("top",null)
  //     .style("left",null)
  //     .style("font-size",null)
  //     ;
  //
  //   // uiElements
  //   //   .transition()
  //   //   .duration(500)
  //   //   .style("opacity",0)
  //   //   ;
  //
  //   uiBoxes.select(".map-wrapper").transition().duration(500).style("top","0px");
  //
  //   uiBoxes
  //     .transition()
  //     .duration(1000)
  //     .style("width",contentContainerWidth/2+"px")
  //     .style("height",contentContainerWidth/2+"px")
  //     .style("top",function(d){
  //       if(d=="incarceration"){
  //         return (contentContainerWidth/2+heightPadding)+"px"
  //       }
  //       return (heightPadding)+"px";
  //     })
  //     .style("left",function(d){
  //       if(d=="incarceration"){
  //         return (contentContainerWidth-(contentContainerWidth/2))/2+"px";
  //       }
  //       if(d=="slavery"){
  //         return null;
  //       }
  //       return contentContainerWidth/2+"px";
  //     })
  //     ;
  //
  // }

  // function uiZoom(chart){
  //
  //   // reduceLabels(chart);
  //
  //   // uiElements
  //   //   .transition()
  //   //   .duration(500)
  //   //   .style("opacity",function(d){
  //   //     if(d3.select(this.parentNode).datum()==chart){
  //   //       return 1;
  //   //     }
  //   //     return 0;
  //   //   })
  //   //   ;
  //
  //   // uiBoxes.select(".map-wrapper").transition().duration(500).style("top",function(d){
  //   //   if(d3.select(this.parentNode).datum()==chart){
  //   //     return "50px"
  //   //   }
  //   //   return "0px";
  //   // });
  //   //
  //   // var iterate = 0;
  //   //
  //   // uiBoxes
  //   //   .transition()
  //   //   .duration(1000)
  //   //   .style("width",function(d){
  //   //     if(d==chart){
  //   //       return "550px";
  //   //     }
  //   //     return "70px"
  //   //   })
  //   //   .style("height",function(d){
  //   //     if(d==chart){
  //   //       return "550px";
  //   //     }
  //   //     return "70px"
  //   //   })
  //   //   .style("top",function(d){
  //   //     if(d==chart){
  //   //       return "0px"
  //   //     }
  //   //     iterate = iterate + 90;
  //   //     return viewportHeight-iterate+"px"
  //   //   })
  //   //   .style("left",function(d){
  //   //     if(d==chart){
  //   //       return (contentContainerWidth-550)/2+"px";
  //   //     }
  //   //     return "-100px";
  //   //   })
  //   //   ;
  //
  // }

  // function slaveryUnZoom(){
  //   slaveZoomed = false;
  //   laHighlight.classed("zoom-highlight-style",false);
  //
  //   svg.transition().duration(750)
  //     .attr("viewBox","350 0 580 580")
  //     ;
  //
  //   statePaths
  //     .style("stroke", null)
  //     .style("stroke-width",null)
  //     ;
  // }

  // function slaveryZoom(){
  //
  //   slaveZoomed = true;
  //
  //   svg.transition().duration(750)
  //     .attr("viewBox","350 200 400 580")
  //     ;
  //
  //   laHighlight.classed("zoom-highlight-style",true);
  //
  //   statePaths
  //     .style("stroke",function(d){
  //       if(+d.id==22){
  //         return "white";
  //       }
  //       return null;
  //     })
  //     .style("stroke-width",function(d){
  //       if(+d.id==22){
  //         return "2px";
  //       }
  //       return null;
  //     })
  //     ;
  // }

  makeLegends();

  uiBoxes
    .style("width",function(d){
      if(d=="slavery"){
        return mapWidth+"px";
      }
      return "70px"
    })
    .style("height",function(d){
      if(d=="slavery"){
        return mapWidth+"px";
      }
      return "70px"
    })
    .style("top",function(d){
      if(d=="slavery"){
        return "0px"
      }
      return "20px"
    })
    .style("left",function(d){
      if(d=="slavery"){
        return (contentContainerWidth-mapWidth)/2+"px";
      }
      return "-100px";
    })
    ;


  setupToggles();
  showStateBubbles(yearBubblesVisible);

  // var moveNavigator = new ScrollMagic.Scene({
  //     // triggerElement: ".third-chart-wrapper",
  //     triggerElement: ".slavery-trigger",
  //     triggerHook:1,
  //     offset: 0,
  //     duration:500
  //   })
  //   // .addIndicators({name: "slavery"}) // add indicators (requires plugin)
  //   .addTo(controller)
  //   .on("enter",function(e){
  //     if(e.target.controller().info("scrollDirection") == "REVERSE"){
  //     }
  //     else{
  //       uiZoom("slavery");
  //     }
  //     ;
  //   })
  //   .on("leave",function(e){
  //     if(e.target.controller().info("scrollDirection") == "FORWARD"){
  //       navigatorElement.transition().duration(1000).style("right","0px");
  //     }
  //     else{
  //       navigatorElement.transition().duration(1000).style("right","-162px");
  //       unZoom();
  //     }
  //   })
  //   ;

  var resetAll = new ScrollMagic.Scene({
      // triggerElement: ".third-chart-wrapper",
      triggerElement: ".slavery-trigger",
      triggerHook:.5,
      offset: 0,
      duration:500
    })
    // .addIndicators({name: "slavery"}) // add indicators (requires plugin)
    .addTo(controller)
    .on("enter",function(e){
      if(yearSelected!="1860"){
        toolTipText = "slaves";

        selectableYears.classed("year-row-selected",false);

        var elementSelected = selectableYears.filter(function(d,i){
          return i==2;
        });

        elementSelected.classed("year-row-selected",true);
        var position = elementSelected.node().getBoundingClientRect();
        doppler(position);

        populationLegendTitle.text("Slave Population")
        slaveryLegendTitle.text("Slave Population as % of Total")
        colorGradient.domain(colorGradientDomain);

        var year = 1860;
        yearPopulationSelected = +year;
        yearSelected = "1860";
        adjustCircles(1000);
        var text = "U.S. Slave Pop. in "+year;
        startLabelChange(text);

      }
    })
    ;


  // var zoomSlavery = new ScrollMagic.Scene({
  //     // triggerElement: ".third-chart-wrapper",
  //     triggerElement: ".zoom-trigger",
  //     triggerHook:.5,
  //     offset: 0,
  //     duration:250
  //   })
  //   .addIndicators({name: "zoom lousiana"}) // add indicators (requires plugin)
  //   .addTo(controller)
  //   .on("enter",function(e){
  //     if(e.target.controller().info("scrollDirection") == "REVERSE"){
  //     }
  //     else{
  //       slaveryZoom();
  //     }
  //     ;
  //   })
  //   .on("leave",function(e){
  //     slaveryUnZoom();
  //     // if(e.target.controller().info("scrollDirection") == "FORWARD"){
  //     // }
  //     // else{
  //     //   slaveryUnZoom();
  //     // }
  //   })
  //   ;

  var zoomPopulation = new ScrollMagic.Scene({
      // triggerElement: ".third-chart-wrapper",
      triggerElement: ".black-pop-trigger",
      triggerHook:.5,
      offset: 0,
      duration:500
    })
    // .addIndicators({name: "population"}) // add indicators (requires plugin)
    .addTo(controller)
    .on("enter",function(e){
      if(yearSelected!="pop_2010"){
        toolTipText = "Black";

        selectableYears.classed("year-row-selected",false);

        var elementSelected = selectableYears.filter(function(d,i){
          return +d3.select(this).text()=="2010";
        });

        elementSelected.classed("year-row-selected",true);
        var position = elementSelected.node().getBoundingClientRect();
        doppler(position);

        populationLegendTitle.text("Black Population")
        slaveryLegendTitle.text("Black Population as % of Total")
        colorGradient.domain(colorGradientDomain);

        var year = 2010;
        yearPopulationSelected = +year;
        yearSelected = "pop_".concat(year);
        adjustCircles(1000);
        var text = "U.S. Black Pop. in "+year;
        startLabelChange(text);

      }

      if(e.target.controller().info("scrollDirection") == "REVERSE"){
      }
      else{
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

  function doppler(position){
    var circle = fixedDiv
      .append("circle")
      .attr("cy",position.top+13)
      .attr("cx",position.left+25)
      .attr("r",6)

    circle
      .transition()
      .duration(2000)
      .ease("linear")
      .attr("r",100)
      .style("opacity",0)
      .each("end",function(){
        d3.select(this).remove();
      })
      ;

  }

  var showBubbles = new ScrollMagic.Scene({
      // triggerElement: ".third-chart-wrapper",
      triggerElement: ".show-bubbles",
      triggerHook:.5,
      offset: 0,
      duration:500
    })
    // .addIndicators({name: "bubbles"}) // add indicators (requires plugin)
    .addTo(controller)
    .on("enter",function(e){

      // toolTipText = "Black";

      var previous = yearBubblesVisible;
      yearAdmissionsElements.classed("admissions-button-selected",false);

      var elementSelected = yearAdmissionsElements.filter(function(d,i){
        return i==3;
      });

      elementSelected.classed("admissions-button-selected",true);
      var position = elementSelected.node().getBoundingClientRect();
      doppler(position);

      var buttonText = "2010";
      svg.classed("bubbles-set",true);
      if(yearBubblesVisible != buttonText){
        yearBubblesVisible=buttonText;
        showStateBubbles(yearBubblesVisible);
      }
      if(previous == false || yearBubblesVisible == false){
        stateIncarcerationLegend
          .style("top",function(){
            if(!yearBubblesVisible){
              return "40px";
            }
            return "20px";
          })
          .style("opacity",function(){
            if(yearBubblesVisible){
              return 0;
            }
            return 1;
          })
          .transition()
          .duration(700)
          .style("top",function(){
            if(yearBubblesVisible){
              return "40px";
            }
            return "20px";
          })
          .style("opacity",function(){
            if(yearBubblesVisible){
              return 1;
            }
            return 0;
          })
          ;
      }
      stateAbv = d3.selectAll(".state-abv")
    })
    .on("leave",function(e){
      var previous = yearBubblesVisible;
      yearAdmissionsElements.classed("admissions-button-selected",false);

      var elementSelected = yearAdmissionsElements.filter(function(d,i){
        return i==0;
      });
      svg.classed("bubbles-set",false);
      elementSelected.classed("admissions-button-selected",true);
      var position = elementSelected.node().getBoundingClientRect();
      doppler(position);

      yearBubblesVisible = false;
      showStateBubbles(yearBubblesVisible);
      if(previous == false || yearBubblesVisible == false){
        stateIncarcerationLegend
          .style("top",function(){
            if(!yearBubblesVisible){
              return "40px";
            }
            return "20px";
          })
          .style("opacity",function(){
            if(yearBubblesVisible){
              return 0;
            }
            return 1;
          })
          .transition()
          .duration(700)
          .style("top",function(){
            if(yearBubblesVisible){
              return "40px";
            }
            return "20px";
          })
          .style("opacity",function(){
            if(yearBubblesVisible){
              return 1;
            }
            return 0;
          })
          ;
      }

    })
    ;

  var zoomIncarceration = new ScrollMagic.Scene({
      // triggerElement: ".third-chart-wrapper",
      triggerElement: ".incar-trigger",
      triggerHook:.5,
      offset: 0
    })
    // .addIndicators({name: "incarceration"}) // add indicators (requires plugin)
    .addTo(controller)
    .on("enter",function(e){
      populationLegendTitle.text("Black Population")
      colorGradient.domain(colorGradientJailDomain);
      var elementSelected = yearIncElements.filter(function(d,i){
        return i==0;
      });
      elementSelected.classed("admissions-button-selected",true);

      var year = 2010;
      yearIncarcerationSelected = +year;
      yearSelected = "jail_".concat(year);
      adjustCircles(1000);
      var text = "Jail Incarceration Rate in "+year;
      startLabels.style("width","249px")
      startLabelChange(text);

      // jailSelector.transition().duration(1000).delay(1000).style("top","47px").each("end",function(){
      //   var position = elementSelected.node().getBoundingClientRect();
      //   doppler(position);
      // })
      fadeOutElements.transition().duration(1000).style("opacity",0);
      slaveryLegendTop.style("opacity",0);
      slaveryLegendBottom.transition().duration(1000).delay(1000).style("opacity",1).style("top","0px");
    })
    .on("leave",function(e){
      toolTipText = "Black";

      selectableYears.classed("year-row-selected",false);

      var elementSelected = selectableYears.filter(function(d,i){
        return +d3.select(this).text()=="2010";
      });

      elementSelected.classed("year-row-selected",true);
      var position = elementSelected.node().getBoundingClientRect();

      populationLegendTitle.text("Black Population")
      slaveryLegendTitle.text("Black Population as % of Total")
      colorGradient.domain(colorGradientDomain);

      var year = 2010;
      yearPopulationSelected = +year;
      yearSelected = "pop_".concat(year);
      adjustCircles(1000);
      var text = "U.S. Black Pop. in "+year;
      startLabels.style("width",null)
      startLabelChange(text);
      fadeOutElements.transition().duration(1000).delay(1000).style("opacity",1);
      slaveryLegendTop.style("opacity",1);
      slaveryLegendBottom.transition().duration(500).style("opacity",null).style("top",null);
    })
    ;

//flag.csv
});
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
