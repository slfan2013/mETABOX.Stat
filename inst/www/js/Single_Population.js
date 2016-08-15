var app = angular.module('populationplot_singlepopulation', []);
app.controller('populationplotctrl_singlepopulation', function($scope) {
    $scope.populationplot = function() {

      var x = seq($scope.min, $scope.max, length=1000)
      var y = pnorm(x,$scope.mean,$scope.sd)
      value = {x: x,y: y,type: 'scatter',name : 'density',   fill: 'tonexty'}
      mean = {x:[$scope.mean,$scope.mean], y:[0,Math.max.apply(null, y)*1.1],mode: 'lines',name :'average'}
      var data = [value,mean];

      var layout = {xaxis: {range: [$scope.min, $scope.max]},yaxis: {range: [Math.min.apply(null, y), Math.max.apply(null, y)*1.1]},paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)'};

      Plotly.newPlot('populationplot_singlepopulation', data,layout);
    }


    $scope.estimatedpopulation = function(){

      var sampleset = [];
      var samplemeans = [];
      var samplesds = [];
      var ys = [];

      for(ii=0;ii<$("#sampletimes_singlepopulation").val();ii++){
        rdm = rnorm($("#samplesize_singlepopulation").val(),mean=$scope.mean,sd=$scope.sd)
        sampleset.push(rdm)
        samplemeans.push(meanFunction(rdm))
        samplesds.push(sdFunction(rdm))
      }

      $scope.samplemeans = samplemeans;
      $scope.samplesds = samplesds







var x = seq($scope.min, $scope.max, length=1000)
    }
});





console.log($("#sampletimes_display_singlepopulation").val())
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
})

