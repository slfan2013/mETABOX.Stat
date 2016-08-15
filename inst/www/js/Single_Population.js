



var app = angular.module('populationplot_singlepopulation', []);
app.controller('populationplotctrl_singlepopulation', function($scope) {
  //Retrieve all the parameters;
  $scope.min = parseInt(localStorage.getItem("smallestvalue_singlepopulation"),10);
  $scope.max = parseInt(localStorage.getItem("largestvalue_singlepopulation"),10);
  $scope.mean = parseInt(localStorage.getItem("mean_singlepopulation"),10);
  $scope.sd = parseInt(localStorage.getItem("sd_singlepopulation"),10);
  $scope.populationplot



  $scope.populationplot = function() {

    var x = seq($scope.min, $scope.max, length=1000)
    var y = pnorm(x,$scope.mean,$scope.sd)
    value = {x: x,y: y,type: 'scatter',name : 'density',   fill: 'tonexty'}
    mean = {x:[$scope.mean,$scope.mean], y:[0,Math.max.apply(null, y)*1.1],mode: 'lines',name :'average'}
    var data = [value,mean];

    var layout = {xaxis: {range: [$scope.min, $scope.max]},yaxis: {range: [Math.min.apply(null, y), Math.max.apply(null, y)*1.1]},paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)'};

    $scope.populationplot_singlepopulation = Plotly.newPlot('populationplot_singlepopulation', data,layout);
  };$scope.populationplot()

    $scope.samplepopulation = function(){

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
      $scope.samplesds = samplesds;


/* need to change to hover event.
      var data = [];
      var mean = [];
      var x = seq($scope.min, $scope.max, length=1000)
      var truey = pnorm(x,$scope.mean,$scope.sd)
      for(ii=0;ii<$("#sampletimes_singlepopulation").val();ii++){
        y = pnorm(x,samplemeans[[ii]],samplesds[[ii]])
        data.push({x:x,y:y,type: 'scatter',name : 'density'+ii,fill: 'tonexty'},{x:[samplemeans[[ii]],samplemeans[[ii]]], y:[0,Math.max.apply(null, y)*1.1],mode: 'lines',name :'average'+ii});
        var layout = {
                        xaxis: {range: [$scope.min, $scope.max]},yaxis: {range: [Math.min.apply(null, truey), Math.max.apply(null, truey)*1.1]},
                        paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)'
                      };
        $scope.samplepopulationplot_singlepopulation = Plotly.newPlot('samplepopulationplot_singlepopulation', data,layout);
      }*/
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

