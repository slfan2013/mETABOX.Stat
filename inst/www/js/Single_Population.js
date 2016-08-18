
var app = angular.module('populationplot_singlepopulation', []);
app.controller('populationplotctrl_singlepopulation', function($scope) {
  $scope.Math = window.Math;// enable using Math functions in html.
  //Retrieve all the parameters;
  $scope.min = parseInt(localStorage.getItem("smallestvalue_singlepopulation"),10);
  $scope.max = parseInt(localStorage.getItem("largestvalue_singlepopulation"),10);
  $scope.mean = parseInt(localStorage.getItem("mean_singlepopulation"),10);
  $scope.sd = parseInt(localStorage.getItem("sd_singlepopulation"),10);
  $scope.displaybottom = false;
  $scope.n = 5;
  $scope.repeat = 1;
  $scope.sampleselected = null;
  $scope.samplemeans = [1];
  $scope.tol = 3;
  $scope.tol_setting_show = false;
  $scope.tol_step = 1;
  $scope.tol_max = Math.floor($scope.mean/10);
  $scope.powersamplerangemin = 2;
  $scope.powersamplerangemax = 100;
  $scope.powersamplerangestep= 1;
  $scope.powermean = 175;
  $scope.powersdmin = 5;
  $scope.powersdmax = 25;
  $scope.powersdstep = 5;
  $scope.powertol = 3
  $scope.toggle_display_power_text = "How many samples do I need?"



  $scope.toggle_display_bottom = function(){
    if($scope.repeat>1){
       $scope.displaybottom = true
    }else{
      $scope.displaybottom = false
    }
  }


  $scope.toggle_tol_setting_singlepopulation = function(){
    $scope.tol_setting_show = !$scope.tol_setting_show
  }

  $scope.sample = function(){
    var sampleset = [];
    var samplemeans = [];
    var samplesds = [];
    var ys = [];
    for(ii=0;ii<$scope.repeat;ii++){
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
    var y = dnorm(x,$scope.mean,$scope.sd)
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
  };$scope.populationplot();
  // click Sample! and draw plot if repeat one time. Otherwise, need users to mouse over.
  $scope.samplepopulation = function(){
    $scope.sample();
    var data = [];
    var mean = [];
    var x = seq($scope.min, $scope.max, length=1000)
    data.push($scope.truevalue);
    for(ii=0;ii<$scope.repeat;ii++){
      var y = dnorm(x,$scope.samplemeans[[ii]].value,$scope.samplesds[[ii]].value)
      data.push([{x:x,y:y,type: 'scatter',name : 'density.sample'+ii,fill: 'tozeroy',"xaxis": "x1","yaxis": "y1"},
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
    if($scope.repeat>1){
      $scope.samplesetplot()
    }

  }
  //hover event.
  $scope.samplesetplot = function(highlight_index = null){
    var x = Array.from(Array($scope.repeat).keys()); // from 0 to repeat-1
    var y = $scope.samplemeans.map(function(a) {return parseFloat(a.value);}) //get the value of same attribute from array.
    data = [{x:[0,$scope.repeat],y:[$scope.mean,$scope.mean],name:"average",mode: 'lines'},//line of true mean.
            {x:x,y:y,type:'scatter',mode: 'lines+markers',name:"estimated average"}         //scatters of sample means.
            ]
    if(highlight_index!==null){ // red dot.
      data.push({x:[highlight_index],y:[parseFloat($scope.samplemeans[highlight_index].value)], type:'scatter', name:"highlighted point", marker:{color:"red",size: 12},mode: 'markers'})
    }

    Plotly.newPlot('samplesetplot_singlepopulation', data,{title:'Randomly Draw ' + $scope.n + " Samples. Repeat " + $scope.repeat + " Times<br>"+
                                                                  "true average:" +$scope.mean + ", sd:"+ $scope.sd+ ", error tolerance:" + $scope.tol,
                                                            yaxis:{range:[$scope.min, $scope.max]},
                                                                  shapes:[
                                                                          {type:'line',x0:0,y0:$scope.mean+$scope.tol,x1:$scope.repeat,y1:$scope.mean+$scope.tol,line: {color: 'red',width:1,dash: 'dashdot'}},//tol upper line.
                                                                          {type:'line',x0:0,y0:$scope.mean-$scope.tol,x1:$scope.repeat,y1:$scope.mean-$scope.tol,line: {color: 'red',width:1,dash: 'dashdot'}}//tol lower line.
                                                                        ]
                                                            });
    var count = 0;
    for(var i=0;i<$scope.repeat;i++){
      if((y[i]<($scope.mean+$scope.tol)) && (y[i]>($scope.mean-$scope.tol))){
        count++;
      }
    }
    $scope.count_perc = (count/$scope.repeat * 100).toFixed(1);
  }
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

  $scope.powerplot = function(){
    var data = [];
    console.log($scope.powersamplerangestep)
    var x = seq($scope.powersamplerangemin,$scope.powersamplerangemax,length = (($scope.powersamplerangemax - $scope.powersamplerangemin)/$scope.powersamplerangestep)+1)
    var sds = seq($scope.powersdmin, $scope.powersdmax, length = (($scope.powersdmax - $scope.powersdmin)/$scope.powersdstep)+1)

  for(ii=0;ii<sds.length;ii++){
    var y = [];

    for(jj=0;jj<x.length;jj++){
      y.push(pnorm([$scope.powermean+$scope.powertol],$scope.powermean, sds[ii]/Math.sqrt(x[jj])) -
             pnorm([$scope.powermean-$scope.powertol],$scope.powermean, sds[ii]/Math.sqrt(x[jj]))) //see wiki sample size determination

    }
      data.push({x:x, y:y,  mode: 'lines+markers', name:"sd="+sds[ii]})
    }
    Plotly.newPlot('powerplot_singlepopulation', data, {title:"Power vs Sample Size <br> at Error tolerance: " + $scope.powertol,height: 500,
                                                         xaxis: {
                                                          title: 'Sample Size',
                                                          titlefont: {
                                                            family: 'Courier New, monospace',
                                                            size: 18,
                                                            color: '#7f7f7f'
                                                          }
                                                        },
                                                        yaxis: {
                                                          title: 'Power',
                                                          titlefont: {
                                                            family: 'Courier New, monospace',
                                                            size: 18,
                                                            color: '#7f7f7f'
                                                          }
                                                        }
    });
  }

$scope.refresh_tol_singlepopulation = function(){
  $("#tol_singlepopulation").slider({
    step:$scope.tol_step,
    max:$scope.tol_max
  });
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

  $("#tol_singlepopulation").slider({});


// save all the parameter
$(".parameter_singlepopulation").change(function(){
  storeItemAndReset("smallestvalue_singlepopulation")
  storeItemAndReset("largestvalue_singlepopulation")
  storeItemAndReset("mean_singlepopulation")
  storeItemAndReset("sd_singlepopulation")
})































})

