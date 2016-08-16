



var app = angular.module('populationplot_singlepopulation', []);
app.controller('populationplotctrl_singlepopulation', function($scope) {
  //Retrieve all the parameters;
  $scope.min = parseInt(localStorage.getItem("smallestvalue_singlepopulation"),10);
  $scope.max = parseInt(localStorage.getItem("largestvalue_singlepopulation"),10);
  $scope.mean = parseInt(localStorage.getItem("mean_singlepopulation"),10);
  $scope.sd = parseInt(localStorage.getItem("sd_singlepopulation"),10);
  $scope.displaybottom = false;
  $scope.n = 5;
  $scope.repeat = 1;
  $scope.sampleselected = null;

  $scope.sample = function(){
    var sampleset = [];
    var samplemeans = [];
    var samplesds = [];
    var ys = [];
    for(ii=0;ii<$("#sampletimes_singlepopulation").val();ii++){
      rdm = rnorm($("#samplesize_singlepopulation").val(),mean=$scope.mean,sd=$scope.sd)
      sampleset.push(rdm)
      samplemeans.push({value:meanFunction(rdm), name:ii+"thsample_singlepopulation"});
      samplesds.push({value:sdFunction(rdm),name:ii+"thsample_singlepopulation"})
    }
    $scope.sampleset = sampleset;
    $scope.samplemeans = samplemeans;
    $scope.samplesds = samplesds;
  }

  $scope.populationplot = function(){
    var x = seq($scope.min, $scope.max, length=1000);
    var y = pnorm(x,$scope.mean,$scope.sd)
    x.push($scope.max);x.push($scope.mean);x.push($scope.mean);x.push($scope.mean);x.push($scope.min);
    y.push(0);y.push(0);y.push(Math.max.apply(null, y)*1.1);y.push(0);y.push(0)
    value = {x: x,y: y,type: 'scatter',name : 'density.true', fill: 'tozeroy',"xaxis": "x1","yaxis": "y1"}
    var data = [value];
    $scope.truevalue = value;
        var layout = {"barmode": "overlay",
                    xaxis1: {range: [$scope.min, $scope.max],"anchor": "y2","domain": [0.0, 1.0],"zeroline": false},
                    "yaxis1": {"anchor": "free", "domain": [ 0.05, 1], "position": 0.0},
                    "yaxis2": {"anchor": "x1", "domain": [0,0.1], "dtick": 1, "showticklabels": false},
                    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)'}

    $scope.populationplot_singlepopulation = Plotly.newPlot('populationplot_singlepopulation', data,layout);
  };$scope.populationplot()

  // click Sample! and draw plot if repeat one time. Otherwise, need users to mouse over.
  $scope.samplepopulation = function(){
    if($("#sampletimes_singlepopulation").val()>1){
      $scope.displaybottom = true;
    }else{
      $scope.displaybottom = false;
    }
    $scope.sample();
    var data = [];
    var mean = [];
    var x = seq($scope.min, $scope.max, length=1000)
    data.push($scope.truevalue);

    for(ii=0;ii<$("#sampletimes_singlepopulation").val();ii++){
      var y = pnorm(x,$scope.samplemeans[[ii]].value,$scope.samplesds[[ii]].value)
      data.push([{x:x,y:y,type: 'scatter',name : 'density.sample'+ii,fill: 'tozeroy',opacity: 0.75,"xaxis": "x1","yaxis": "y1"},
      {x:$scope.sampleset[[ii]],y:rep('data.sample'+ii,$("#samplesize_singlepopulation").val()),name:'data.sample'+ii,"showlegend": false,"type": "scatter","mode": "markers",
      "marker": {"color": "rgb(255, 127, 14)","symbol": "line-ns-open"},"xaxis": "x1","yaxis": "y2"},
      {x:[$scope.samplemeans[ii].value,$scope.samplemeans[ii].value], y:[0,Math.max.apply(null, y)*1.1],mode: 'lines',name :'sample.average',marker:{color:'#cc6600'}}]);
    }
    var layout = {"barmode": "overlay",
                    xaxis1: {range: [$scope.min, $scope.max],"anchor": "y2","domain": [0.0, 1.0],"zeroline": false},
                    "yaxis1": {"anchor": "free", "domain": [ 0.05, 1], "position": 0.0},
                    "yaxis2": {"anchor": "x1", "domain": [0,0.1], "dtick": 1, "showticklabels": false},
                    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
                    annotations: [{x: $scope.samplemeans[0].value,y: 0,xref: 'x',yref: 'y',text: $scope.samplemeans[0].value,showarrow: true,arrowhead: 2,ax: 20,ay: -30}]
                  };
    $scope.sampledata = data;
    $scope.samplelayout = layout;
    $scope.samplepopulationplot_singlepopulation = Plotly.newPlot('populationplot_singlepopulation',
            [data[0],data[1][0],data[1][1],data[1][2]],layout);

    $scope.samplesetplot()
  }


  $scope.samplesetplot = function(highlight_index = null){
    var x = Array.from(Array($scope.repeat).keys());
    var y = $scope.samplemeans.map(function(a) {return parseFloat(a.value);})
    data = [{x:[0,$scope.repeat-1],y:[$scope.mean,$scope.mean],name:"average",mode: 'lines'},{x:x,y:y,type:'scatter',mode: 'lines+markers',name:"estimated average"}]
    if(highlight_index!==null){
      data.push({x:[highlight_index],y:[parseFloat($scope.samplemeans[highlight_index].value)], type:'scatter', name:"highlighted point", marker:{color:"red"},mode: 'markers'})
    }
    Plotly.newPlot('samplesetplot_singlepopulation', data,{yaxis:{range:[$scope.min, $scope.max]}});
  }

  //hover event.

  $scope.setSelected = function(sampleselected) {
  $scope.sampleselected = sampleselected;
  data = $scope.sampledata[extractNumber($scope.sampleselected)+1]
  var layout = {"barmode": "overlay",
              xaxis1: {range: [$scope.min, $scope.max],"anchor": "y2","domain": [0.0, 1.0],"zeroline": false},
              "yaxis1": {"anchor": "free", "domain": [ 0.05, 1], "position": 0.0},
              "yaxis2": {"anchor": "x1", "domain": [0,0.1], "dtick": 1, "showticklabels": false},
              paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
              annotations: [{x: $scope.samplemeans[extractNumber($scope.sampleselected)].value,y: 0,xref: 'x',yref: 'y',text: $scope.samplemeans[extractNumber(sampleselected)].value,showarrow: true,arrowhead: 2,ax: 20,ay: -30}]
        };
  $scope.samplepopulationplot_singlepopulation = Plotly.newPlot('populationplot_singlepopulation',
           [$scope.truevalue,data[0],data[1],data[2]],layout);
  $scope.samplesetplot(extractNumber($scope.sampleselected))
}


});





$(document).ready(function(){
$("#samplesize_singlepopulation").slider();
$("#samplesize_singlepopulation").on("slide", function(slideEvt) {
	$("#samplesize_display_singlepopulation").text(slideEvt.value);
});

$("#sampletimes_singlepopulation").slider({
});
  $("#sampletimes_singlepopulation").on("slide", function(slideEvt) {
	$("#sampletimes_display_singlepopulation").text(slideEvt.value);
});
// save all the parameter
$(".parameter_singlepopulation").change(function(){
  storeItemAndReset("smallestvalue_singlepopulation")
  storeItemAndReset("largestvalue_singlepopulation")
  storeItemAndReset("mean_singlepopulation")
  storeItemAndReset("sd_singlepopulation")
})



})

