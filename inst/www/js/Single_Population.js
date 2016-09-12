paused = false;

var rdmdatas = [];
var app = angular.module('populationplot_singlepopulation', ['frapontillo.bootstrap-switch']);
app.controller('populationplotctrl_singlepopulation', function($scope) {
  $scope.Math = window.Math;// enable using Math functions in html.
  //Retrieve all the parameters;
  $scope.min = parseInt(localStorage.getItem("smallestvalue_singlepopulation"),10);
  $scope.max = parseInt(localStorage.getItem("largestvalue_singlepopulation"),10);
  $scope.mean = parseInt(localStorage.getItem("mean_singlepopulation"),10);
  $scope.sd = parseInt(localStorage.getItem("sd_singlepopulation"),10);
  $scope.displaybottom = false;
  $scope.n = 5;
  $scope.repeat = false;
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
  $scope.samplemean = [];
  $scope.samplesd = [];
	function onClicksampleset(e) {
  var data = []
    var x = seq($scope.min, $scope.max, length=1000)
		var y = dnorm(x,meanFunction(rdmdatas[e.dataPoint.x]),sdFunction(rdmdatas[e.dataPoint.x]))
    data.push([{x:x,y:y,type: 'scatter',name : 'density.sample'+ii,fill: 'tozeroy',"xaxis": "x1","yaxis": "y1",marker:{color:'#cc6600'},"showlegend": false},
      {x:$scope.sampleset[[ii]],y:rep('data.sample'+ii,$("#").val()),name:'data.sample'+ii,"showlegend": false,"type": "scatter","mode": "markers",
      "marker": {"color": "rgb(255, 127, 14)","symbol": "line-ns-open"},"xaxis": "x1","yaxis": "y2"},
      {x:[meanFunction(rdmdatas[e.dataPoint.x]),meanFunction(rdmdatas[e.dataPoint.x])], y:[0,Math.max.apply(null, y)*1.1],mode: 'lines',name :'sample.average',marker:{color:'#cc6600'},"showlegend": false}]);
          var layout = {"barmode": "overlay",
                    xaxis1: {range: [$scope.min, $scope.max],"anchor": "y2","domain": [0.0, 1.0],"zeroline": false},
                    "yaxis2": {"anchor": "x1", "domain": [0,0.1], "dtick": 1, "showticklabels": false},
                    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
                    annotations: [{x: meanFunction(rdmdatas[e.dataPoint.x]),y: 0,xref: 'x',yref: 'y',text: meanFunction(rdmdatas[e.dataPoint.x]),showarrow: true,arrowhead: 2,ax: 20,ay: -30}]
                  };
    Plotly.newPlot('sampleplot_singlepopulation',
            [data[0][0],data[0][1],data[0][2]],layout);
  $scope.samplemean = meanFunction(rdmdatas[e.dataPoint.x]);
  $("#samplemean").text(meanFunction(rdmdatas[e.dataPoint.x]) + " ("+(meanFunction(rdmdatas[e.dataPoint.x]) - $scope.mean).toFixed(2)+")");
  $scope.samplesd = sdFunction(rdmdatas[e.dataPoint.x]);
  $("#samplesd").text(sdFunction(rdmdatas[e.dataPoint.x]) + " ("+(sdFunction(rdmdatas[e.dataPoint.x]) - $scope.sd).toFixed(2)+")");
	}





  $scope.toggle_tol_setting_singlepopulation = function(){
    $scope.tol_setting_show = !$scope.tol_setting_show
  }

  $scope.sample = function(){
    var sampleset = [];
    var samplemeans = [];
    var samplesds = [];
    var ys = [];
    for(ii=0;ii<1;ii++){
      rdm = rnorm($("#").val(),mean=$scope.mean,sd=$scope.sd)
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
                    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
          annotations: [{x: $scope.mean,y: 0,xref: 'x',yref: 'y',text: $scope.mean,showarrow: true,arrowhead: 2,ax: 20,ay: -30}]
        }

    $scope.populationplot_singlepopulation = Plotly.newPlot('populationplot_singlepopulation', data,layout);
  };$scope.populationplot();
  // click Sample! and draw plot if repeat one time. Otherwise, need users to mouse over.
  $scope.samplepopulation = function(){
    $scope.sample();
    var data = [];
    var x = seq($scope.min, $scope.max, length=1000)
    data.push($scope.truevalue);
    for(ii=0;ii<1;ii++){
      var y = dnorm(x,$scope.samplemeans[[ii]].value,$scope.samplesds[[ii]].value)
      data.push([{x:x,y:y,type: 'scatter',name : 'density.sample'+ii,fill: 'tozeroy',"xaxis": "x1","yaxis": "y1",marker:{color:'#cc6600'},"showlegend": false},
      {x:$scope.sampleset[[ii]],y:rep('data.sample'+ii,$("#").val()),name:'data.sample'+ii,"showlegend": false,"type": "scatter","mode": "markers",
      "marker": {"color": "rgb(255, 127, 14)","symbol": "line-ns-open",size:12},"xaxis": "x1","yaxis": "y2"},

      {x:[$scope.samplemeans[ii].value,$scope.samplemeans[ii].value], y:[0,Math.max.apply(null, y)*1.1],mode: 'lines',name :'sample.average',marker:{color:'#cc6600'},"showlegend": false}]);
    }
    var layout = {"barmode": "overlay",
                    xaxis1: {range: [$scope.min, $scope.max],"anchor": "y2","domain": [0.0, 1.0],"zeroline": false},
                    "yaxis1": {"anchor": "free", "domain": [ 0.05, 1], "position": 0.0},
                    "yaxis2": {"anchor": "x1", "domain": [0,0.1], "dtick": 1, "showticklabels": false},
                    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
                    annotations: [{x: $scope.samplemeans[0].value,y: 0,xref: 'x',yref: 'y',text: $scope.samplemeans[0].value,showarrow: true,arrowhead: 2,ax: 20,ay: -30}]
                  };
    $scope.sampledata = data;
    $scope.sampleplot_singlepopulation = Plotly.newPlot('sampleplot_singlepopulation',
            [data[1][0],data[1][1],data[1][2]],layout);
  $("#samplemean").text($scope.samplemeans[[0]].value + " ("+($scope.samplemeans[[0]].value - $scope.mean).toFixed(2)+")");
  $("#samplesd").text($scope.samplesds[[0]].value + " ("+($scope.samplesds[[0]].value - $scope.sd).toFixed(2)+")");
    if($scope.repeat){

      $scope.displaybottom = true;$('#sampletrigger').attr('href','#section2');

      $scope.samplesetplot()

    }else{
      $scope.displaybottom = false;$('#sampletrigger').attr('href',"javascript:void(0);");
    }
  }


  var chart;
  var numerator = 0; var denominator = 1;
  var dps = []; // dataPoints
  var repeat_plot=[];
  //hover event.
  $scope.samplesetplot = function(highlight_index = null){
    if(repeat_plot>0){
      clearInterval(repeat_plot);
    }
    if(paused){
      $scope.PlayPress();
    }

   dps = []; // dataPoints
  setTimeout(function(){
    chart = new CanvasJS.Chart("samplesetplot_singlepopulation",{
			title :{
				text: 'Randomly Draw ' + $scope.n + " Samples. Repeat " + 1 + " Times"
			},
			subtitles:[{
			  text:"true average:" +$scope.mean + ", sd:"+$scope.sd+ ", error tolerance:" + $scope.tol
			}],
			axisY:{
        title: "estimated mean",
        titleFontFamily: "arial",
        includeZero: false,
        stripLines:[
    			{
    				startValue:172,
    				endValue:178,
    				color:"#d8d8d8"
    			}
			   ],
			   maximum:$scope.max,
			   minimum:$scope.min
      },
			data: [{
				type: "spline",
				markerType: "square",
				dataPoints: dps,
				click: onClicksampleset
			}]
		});
		var xVal = 0;
		var yVal = 100;
		var updateInterval = 100;
    var dataLength = 200; // number of dataPoints visible at any point
    rdmdatas = [];
    denominator = 1
    numerator = 0
    var updateChart = function (cnt) {
			cnt = cnt || 1;
      denominator++;
			// cnt is number of times loop runs to generate random dataPoints.
			for (var j = 0; j < cnt; j++) {
			  var random = rnorm($scope.n,mean=$scope.mean,sd=$scope.sd)
				yVal = meanFunction(random)
				rdmdatas.push(random)
				if((yVal<($scope.mean+$scope.tol)) && (yVal>($scope.mean-$scope.tol))){
				  numerator++;
				}
				dps.push({
					x: xVal,
					y: yVal
				});
				xVal++;
			};
			if (dps.length > dataLength)
			{
				dps.shift();
			}
    $("#count_perc").html((Number((numerator/denominator).toFixed(5))*100).toFixed(3)+"%");
			chart.render();
			chart.options.title.text = 'Randomly Draw ' + $scope.n + " Samples. Repeat " + denominator + " Times"
			chart.options.subtitles[0].text = "true average:" +$scope.mean + ", sd:"+
				      $scope.sd+ ", error tolerance:" + $scope.tol
		};


    updateChart(1);// generates first set of dataPoints
    repeat_plot = setInterval(function(){
      if(!paused){
        updateChart(1)// update chart after specified time.
      }
    }, updateInterval);
  },1200)

  }

  $scope.updatetolrangeonplot = function(){
    chart.options.axisY.stripLines[0].startValue = $scope.mean - $scope.tol;
    chart.options.axisY.stripLines[0].endValue = $scope.mean + $scope.tol;
    chart.options.subtitles[0].text = "true average:" +$scope.mean + ", sd:"+
				      $scope.sd+ ", error tolerance:" + $scope.tol
		var Ys = dps.map(function(a) {return parseFloat(a.y);});
		numerator = 0
    for(var i = 0; i < Ys.length; i++){
        if((Ys[i]<($scope.mean+$scope.tol)) && (Ys[i]>($scope.mean-$scope.tol))){
          numerator++
        }
    }
    console.log(numerator)
    $("#count_perc").html((Number((numerator/denominator).toFixed(5))*100).toFixed(3)+"%");

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
  $scope.sampleplot_singlepopulation = Plotly.newPlot('sampleplot_singlepopulation',
           [data[0],data[1],data[2]],layout);
  //$scope.samplesetplot(extractNumber($scope.sampleselected))
}

  $scope.powerplot = function(){
    var data = [];
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
$scope.PlayPress = function(){
  if(paused){
      paused = !paused;
      $("#button_play>i").attr("class", "fa fa-pause");
    }else{
      paused = !paused;
      $("#button_play>i").attr("class", "fa fa-play");
    }
}
});



$(document).ready(function(){


$("#samplesize_singlepopulation").slider();
$("#samplesize_singlepopulation").on("slide", function(slideEvt) {
	$("#samplesize_display_singlepopulation").text(slideEvt.value);
});

/*$("#sampletimes_singlepopulation").slider({
});
  $("#sampletimes_singlepopulation").on("slide", function(slideEvt) {
	$("#sampletimes_display_singlepopulation").text(slideEvt.value);
});
$("[name='my-checkbox']").bootstrapSwitch();
*/

  $("#tol_singlepopulation").slider({});


// save all the parameter
$(".parameter_singlepopulation").change(function(){
  storeItemAndReset("smallestvalue_singlepopulation")
  storeItemAndReset("largestvalue_singlepopulation")
  storeItemAndReset("mean_singlepopulation")
  storeItemAndReset("sd_singlepopulation")
})




 $("#sampletrigger").click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });















})

