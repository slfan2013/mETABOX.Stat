var app = angular.module('populationplot_twopopulation', []);
app.controller('populationplotctrl_twopopulation', function($scope) {
$scope.min = 140;
$scope.max = 200;
$scope.mean1=165;
$scope.mean2=175;
$scope.sd1=10;
$scope.sd2=10;
$scope.repeat = 1;
$scope.n = 5
$scope.alpha = 0.05;

$scope.sd2equaltosd1 = function(){
  console.log($scope.equal_sd);
  if($scope.equal_sd){
    $scope.sd2 = $scope.sd1;
  }
}

$scope.populationplot = function(){
  var x1 = seq($scope.min, $scope.max, length=1000);
  var x2 = seq($scope.min, $scope.max, length=1000);
  var y1 = dnorm(x1,$scope.mean1,$scope.sd1)
  var y2 = dnorm(x2,$scope.mean2,$scope.sd2)
  x1.push($scope.max);x1.push($scope.mean1);x1.push($scope.mean1);x1.push($scope.mean1);x1.push($scope.min);
  x2.push($scope.max);x2.push($scope.mean2);x2.push($scope.mean2);x2.push($scope.mean2);x2.push($scope.min);
  y1.push(0);y1.push(0);y1.push(Math.max.apply(null, y1)*1.1);y1.push(0);y1.push(0)
  y2.push(0);y2.push(0);y2.push(Math.max.apply(null, y2)*1.1);y2.push(0);y2.push(0)
  value1 = {x: x1,y: y1,type: 'scatter',mode: 'lines',name : 'density1.true', fill: 'tozeroy',"xaxis": "x1","yaxis": "y1", line: {color:"#0047b3"}}
  value2 = {x: x2,y: y2,type: 'scatter',mode: 'lines',name : 'density2.true', fill: 'tozeroy',"xaxis": "x1","yaxis": "y1", line: {color:"#0047b3",dash: 'dot'}}
  var data = [value1,value2];
  $scope.truevalue1 = value1;
  $scope.truevalue2 = value2;
      var layout = {"barmode": "overlay",
                  xaxis1: {range: [$scope.min, $scope.max],"anchor": "y2","domain": [0.0, 1.0],"zeroline": false},
                  "yaxis1": {"anchor": "free", "domain": [ 0.05, 1], "position": 0.0},
                  "yaxis2": {"anchor": "x1", "domain": [0,0.1], "dtick": 1, "showticklabels": false},
                  paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)'}

  $scope.populationplot_twopopulation = Plotly.newPlot('populationplot_twopopulation', data,layout);
};$scope.populationplot();


  $scope.sample = function(){
    var sampleset1 = [];var sampleset2 = [];
    var samplemeans1 = [];var samplemeans2 = [];
    var samplesds1 = [];var samplesds2 = [];
    var ys1 = [];var ys2 = [];
    for(ii=0;ii<$scope.repeat;ii++){
      rdm1 = rnorm($("#samplesize_twopopulation").val(),mean=$scope.mean1,sd=$scope.sd1);rdm2 = rnorm($("#samplesize_twopopulation").val(),mean=$scope.mean2,sd=$scope.sd2)
      sampleset1.push(rdm1);sampleset2.push(rdm2);
      samplemeans1.push({value:meanFunction(rdm1), name:ii+"thsample_twopopulation1"});samplemeans2.push({value:meanFunction(rdm2), name:ii+"thsample_twopopulation2"});
      samplesds1.push({value:sdFunction(rdm1),name:ii+"thsample_singlepopulation1"});samplesds2.push({value:sdFunction(rdm2),name:ii+"thsample_singlepopulation2"})
    }
    $scope.sampleset1 = sampleset1;$scope.sampleset2 = sampleset2;
    $scope.samplemeans1 = samplemeans1;$scope.samplemeans2 = samplemeans2;
    $scope.samplesds1 = samplesds1;$scope.samplesds2 = samplesds2;
  }

  $scope.samplepopulation = function(){
      $scope.sample();
      var data = [];
      var x = seq($scope.min, $scope.max, length=1000)
      data.push($scope.truevalue1);data.push($scope.truevalue2);
      for(ii=0;ii<$scope.repeat;ii++){
        var y1 = dnorm(x,$scope.samplemeans1[[ii]].value,$scope.samplesds1[[ii]].value);var y2 = dnorm(x,$scope.samplemeans2[[ii]].value,$scope.samplesds2[[ii]].value)
        data.push([{x:x,y:y1,type: 'scatter',mode: 'lines',name : 'density1.sample'+ii,fill: 'tozeroy',"xaxis": "x1","yaxis": "y1", line: {color:"#cc6600"}},
        {x:$scope.sampleset1[[ii]],y:rep('data1.sample'+ii,$("#samplesize_twopopulation").val()),name:'data1.sample'+ii,"showlegend": false,"type": "scatter","mode": "markers",
        "marker": {"color": "rgb(255, 127, 14)","symbol": "line-ns-open"},"xaxis": "x1","yaxis": "y2"},
        {x:[$scope.samplemeans1[ii].value,$scope.samplemeans1[ii].value], y:[0,Math.max.apply(null, y1)*1.1],mode: 'lines',name :'sample.average',marker:{color:'#cc6600'}}]);

        data.push([{x:x,y:y2,type: 'scatter',mode: 'lines',name : 'density2.sample'+ii,fill: 'tozeroy',"xaxis": "x1","yaxis": "y1", line: {color:"#cc6600",dash:"dot"}},
        {x:$scope.sampleset2[[ii]],y:rep('data2.sample'+ii,$("#samplesize_twopopulation").val()),name:'data2.sample'+ii,"showlegend": false,"type": "scatter","mode": "markers",
        "marker": {"color": "rgb(255, 127, 14)","symbol": "line-ns-open"},"xaxis": "x1","yaxis": "y2"},
        {x:[$scope.samplemeans2[ii].value,$scope.samplemeans2[ii].value], y:[0,Math.max.apply(null, y2)*1.1],mode: 'lines',name :'sample.average',marker:{color:'#cc6600'}}]);
      }
      var layout = {"barmode": "overlay",
                      xaxis1: {range: [$scope.min, $scope.max],"anchor": "y2","domain": [0.0, 1.0],"zeroline": false},
                      "yaxis1": {"anchor": "free", "domain": [ 0.05, 1], "position": 0.0},
                      "yaxis2": {"anchor": "x1", "domain": [0,0.1], "dtick": 1, "showticklabels": false},
                      paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
                      annotations: [{x: $scope.samplemeans1[0].value,y: 0,xref: 'x',yref: 'y',text: $scope.samplemeans1[0].value,showarrow: true,arrowhead: 2,ax: -20,ay: -30},
                                    {x: $scope.samplemeans2[0].value,y: 0,xref: 'x',yref: 'y',text: $scope.samplemeans2[0].value,showarrow: true,arrowhead: 2,ax: 20,ay: -30}]
                    };
      $scope.sampledata = data;
      $scope.samplepopulationplot_twopopulation = Plotly.newPlot('populationplot_twopopulation',
              [data[0],data[1],data[2][0],data[2][1],data[2][2],data[3][0],data[3][1],data[3][2]],layout);
      if($scope.repeat>1){
        $scope.samplesetplot()
      }

    }


  $scope.samplesetplot = function(highlight_index = null){
    var x = Array.from(Array($scope.repeat).keys()); // from 0 to repeat-1
    var t = [];
    for(ii=0;ii<x.length;ii++){
      t.push(($scope.samplemeans1[[ii]].value - $scope.samplemeans2[[ii]].value)/Math.sqrt(Math.pow($scope.samplesds1[[ii]].value,2)/$scope.n + Math.pow($scope.samplesds2[[ii]].value,2)/$scope.n))
    }
    data = [{x:[0,$scope.repeat],y:[0,0],name:"diff = 0",mode: 'lines'},//when null hypothesis is correct.
            {x:x,y:t,type:'scatter',mode: 'lines+markers',name:"t statistic"}         //scatters of sample means.
            ]
    if(highlight_index!==null){ // red dot.
      data.push({x:[highlight_index],y:t[highlight_index], type:'scatter', name:"highlighted point", marker:{color:"red",size: 12},mode: 'markers'})
    }

    Plotly.newPlot('samplesetplot_twopopulation', data,{title:'Randomly Draw ' + $scope.n + " Samples. Repeat " + $scope.repeat + " Times<br>green area is the rejecting area",
                                                            yaxis:{range:[Math.min(tdistr($scope.n,0.9999),t.min()), Math.max(tdistr($scope.n,0.0001),t.max())]}
                                                                  ,shapes:[
                                                                          {type:'rect',x0:0,y0:tdistr($scope.n,$scope.alpha/2),x1:$scope.repeat,y1:Math.max(tdistr($scope.n,0.0001),t.max()),
                                                                          fillcolor:'green',line:{width:0},opacity: 0.15},//tol upper line.
                                                                          {type:'rect',x0:0,y0:tdistr($scope.n,1-$scope.alpha/2),x1:$scope.repeat,y1:Math.min(tdistr($scope.n,0.9999),t.min()),
                                                                          fillcolor:'green',line:{width:0},opacity: 0.15}//tol lower line.
                                                                        ]
                                                            });
    var count = 0;
    for(var i=0;i<$scope.repeat;i++){
      if(t[i]<tdistr($scope.n,1-$scope.alpha/2) || t[i]>tdistr($scope.n,$scope.alpha/2)){
        count++;
      }
    }
    $scope.count_perc = (count/$scope.repeat * 100).toFixed(1);
  }





})






$(document).ready(function(){
  $("#samplesize_twopopulation").slider();
  $("#samplesize_twopopulation").on("slide", function(slideEvt) {
  	$("#samplesize_display_twopopulation").text(slideEvt.value);
  });

  $("#alpha_twopopulation").slider({});

  $("#sampletimes_twopopulation").slider({
  });
    $("#sampletimes_twopopulation").on("slide", function(slideEvt) {
  	$("#sampletimes_display_twopopulation").text(slideEvt.value);
  });
})

