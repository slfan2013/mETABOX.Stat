var app = angular.module('samplesize', []);
app.controller('samplesizectrl', function($scope) {
  $scope.Math = window.Math;// enable using Math functions in html.
  $scope.factors = 'one factor';//default one factor is selected.
  $scope.test = {groups:""}
  $scope.caleffectsize = {}
  $scope.numofeffectsizes = 4

  $scope.calculateeffectsize = function(){
   if($scope.test.groups == "two independent groups"){
     $scope.effectsizevalue = Math.abs($scope.caleffectsize.mean1 - $scope.caleffectsize.mean2)/Math.sqrt((Number(Math.pow($scope.caleffectsize.sd1,2)) + Number(Math.pow($scope.caleffectsize.sd2,2)))/2)
   }else if($scope.test.groups == "two paired groups"){
     $scope.effectsizevalue = Math.abs($scope.caleffectsize.mean1 - $scope.caleffectsize.mean2)/Math.sqrt((Number(Math.pow($scope.caleffectsize.sd1,2)) + Number(Math.pow($scope.caleffectsize.sd2,2)) - 2*$scope.caleffectsize.corr*$scope.caleffectsize.sd1*$scope.caleffectsize.sd2))
   }else if($scope.test.groups == "multiple independent groups"){
     diffmean = [];
     console.log(Object.keys($scope.caleffectsize).length)
     for(ii=1;ii<$scope.numofeffectsizes-1;ii++){
       $scope.caleffectsize["mean1"]
     }
   }
  }



})


app.directive("addeffectsizes", function($compile){
  	return function(scope, element, attrs){
  		element.bind("click", function(){
  		  scope.numofeffectsizes++;
  			angular.element(document.getElementById('addedeffectsized_samplesize'))
  			.append($compile('<div class="row" id=effectsizediv'+scope.numofeffectsizes+'><div class="col-lg-6"><label>Mean '+scope.numofeffectsizes+'</label><input class="form-control" type="number" ng-model="caleffectsize.mean'+scope.numofeffectsizes+'" ng-change="calculateeffectsize();"></div><div class="col-lg-6"><label>SD '+scope.numofeffectsizes+'</label><input class="form-control" type="number" ng-model="caleffectsize.sd'+scope.numofeffectsizes+'" ng-change="calculateeffectsize();" min=0></div></div>'
  			  //"<div id=effectsizediv"+scope.numofeffectsizes+"><label>Effect size:</label><button class='pull-right btn btn-default btn-xs btn-outline' removeeffectsize><i class='fa fa-minus'></i></button><input id=effectsize"+scope.numofeffectsizes+" class='form-control' type = 'number' min = 0 step=0.05></div>"
  			  )(scope));
  		});
  	};
  });

  app.directive("removeeffectsize", function($rootScope) {
      return {
            link:function(scope,element,attrs)
            {
                element.bind("click",function() {
                  var ele = angular.element( document.querySelector( '#effectsizediv'+ scope.numofeffectsizes) );
                    ele.remove();
                    scope.numofeffectsizes--;
                    console.log(scope.numofeffectsizes)
                });
            }
      };
  });




$(document).ready(function(){



})
