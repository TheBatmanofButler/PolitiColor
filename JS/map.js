function ready(error, us, congress, callback) {

  var width = Math.floor($('.map-container').width() - 30),
      height = Math.floor($('.map-container').height());

  var rateById = d3.map();

  var quantize = d3.scale.quantize()
      .domain([0, .15])
      .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

  var projection = d3.geo.albersUsa()
      .scale(width)
      .translate([width / 2, height / 2]);

  var path = d3.geo.path()
      .projection(projection);

  var svg = d3.select(".map-container").append("svg")
      .attr("width", width)
      .attr("height", height);

  var features = svg.append("g");    
    /**features.call(zoom)
    .on("mousedown.zoom", null)
    .on("touchstart.zoom", null)
    .on("touchmove.zoom", null)
    .on("touchend.zoom", null);**/

  features.append("defs").append("path")
      .attr("id", "land")
      .datum(topojson.feature(us, us.objects.land))
      .attr("d", path)

  features.append("clipPath")
      .attr("id", "clip-land")
    .append("use")
      .attr("xlink:href", "#land");

  var counter = 0; 
  
  features.append("path")
      .datum(topojson.feature(us, us.objects.land))
      .attr("class", "land")
      .attr("d", path);

  features.append("g")
      .attr("class", "states")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("id", function(d) { return 'w' + counter++; })
      .attr("d", path);
  
  features.append("path")
      .attr("class", "state-boundaries")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("d", path);
}

//-----------------------------------------------------------------------------------------------------------------

var socket = io('http://52.90.127.98:8010');


var colorMap = {
  "trump":"rgba(233,29,14,",
  "cruz":"rgba(233,29,14,",
  "sanders":"rgba(35,32,102,",
  "clinton":"rgba(35,32,102,",
  "democrat":"rgba(35,32,102,",
  "republican":"rgba(233,29,14,"
}


$(document).ready(function() {

  $('html').fadeIn('slow');

  ready(null, us, congress);

});


var mostRecentTrump = {};
var mostRecentCruz = {};
var mostRecentClinton = {};
var mostRecentSanders = {};
var mostRecentDemocrat = {};
var mostRecentRepublican = {};

var subjToStore = {
  'trump':mostRecentTrump,
  'cruz':mostRecentCruz,
  'clinton':mostRecentClinton,
  'sanders':mostRecentSanders,
  'democrat':mostRecentDemocrat,
  'republican':mostRecentRepublican
}

var stateToNum = {
  AL:"w44",
  AK:"w50",
  AZ:"w36",
  AR:"w42",
  CA:"w21",
  CO:"w27",
  CT:"w19",
  DE:"w31",
  DC:"w35",
  FL:"w48",
  GA:"w45",
  HI:"w49",
  ID:"w2",
  IL:"w17",
  IN:"w25",
  IA:"w14",
  KS:"w30",
  KY:"w34",
  LA:"w47",
  ME:"w5",
  MD:"w32",
  MA:"w16",
  MI:"w6",
  MN:"w4",
  MS:"w46",
  MO:"w29",
  MT:"w1",
  NE:"w15",
  NV:"w23",
  NH:"w10",
  NJ:"w26",
  NM:"w38",
  NY:"w12",
  NC:"w40",
  ND:"w3",
  OH:"w24",
  OK:"w37",
  OR:"w8",
  PA:"w18",
  RI:"w20",
  SC:"w43",
  SD:"w9",
  TN:"w39",
  TX:"w41",
  UT:"w22",
  VT:"w11",
  VA:"w33",
  WA:"w0",
  WV:"w28",
  WI:"w7",
  WY:"w13"
}

var currentCandidate = "";

function getIDFromTweet(tweetObj) {
  //return stateToNum[tweetObj.loc.state];
  return "w" + tweetObj.loc.state;
}

function getColorFromTweet(tweetObj) {
  return colorMap[tweetObj.subj] + tweetObj.sent + ")";
}

function mapColors() {
  for(key in stateToNum) {

    if(currentCandidate === 'repub-dem') {

      var repubVal = 0;
      var demVal = 0;

      if(mostRecentRepublican[stateToNum[key]])
        repubVal = mostRecentRepublican[stateToNum[key]].sent;

      if(mostRecentDemocrat[stateToNum[key]])
        demVal = mostRecentDemocrat[stateToNum[key]].sent;

      console.log(repubVal)
      console.log(demVal)

      var value = 0;

      if(repubVal > demVal) {
        value = repubVal - demVal;
        color = colorMap['republican'] + value + ")";
      } else if (demVal > repubVal) {
        value = demVal - repubVal;
        color = colorMap['democrat'] + value + ")";
      } else {
        color = '#FFF';
      }

      d3.select('#' + stateToNum[key]).attr({"fill":color});

    } else {

      if(subjToStore[currentCandidate][stateToNum[key]])
        d3.select('#' + stateToNum[key]).attr({"fill":subjToStore[currentCandidate][stateToNum[key]].color});
      else
        d3.select('#' + stateToNum[key]).attr({"fill":'#FFF'});

    }
  }
}

function processData(data) {  
  var id = getIDFromTweet(data);
  var color = getColorFromTweet(data);
  data.id = id;
  data.color = color;
  subjToStore[data.subj][id] = data;

  if(data.subj === currentCandidate || currentCandidate === 'repub-dem')
    mapColors();
}

socket.on('serverToClient', function(data){
  processData(data);
});

$('.trump').click(function() {
  currentCandidate = 'trump';

});

$('.cruz').click(function() {
  currentCandidate = 'cruz';
});

$('.sanders').click(function() {
  currentCandidate = 'sanders';
});

$('.clinton').click(function() {
  currentCandidate = 'clinton';
});

$('.repub-dem').click(function() {
  currentCandidate = 'repub-dem';
});

