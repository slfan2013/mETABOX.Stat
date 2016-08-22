var numofeffectsizes = 3;


var app = angular.module('samplesize', []);
app.controller('samplesizectrl', function($scope) {
  $scope.Math = window.Math;// enable using Math functions in html.
  $scope.factors = 'one factor';//default one factor is selected.
  $scope.test = {groups:""}
  $scope.caleffectsize = {}
  $scope.otherpara = {correlation:0.5,epsilon:0.75}
  $scope.numofeffectsizes = 3;
  $scope.alpha=0.05;
  $scope.power = 0.8;


  $scope.calculateeffectsize = function(){
   if($scope.test.groups == "two independent groups"){
     $scope.effectsizevalue = Math.abs($scope.caleffectsize.mean1 - $scope.caleffectsize.mean2)/Math.sqrt((Number(Math.pow($scope.caleffectsize.sd1,2)) + Number(Math.pow($scope.caleffectsize.sd2,2)))/2)
   }else if($scope.test.groups == "two paired groups"){
     $scope.effectsizevalue = Math.abs($scope.caleffectsize.mean1 - $scope.caleffectsize.mean2)/Math.sqrt((Number(Math.pow($scope.caleffectsize.sd1,2)) + Number(Math.pow($scope.caleffectsize.sd2,2)) - 2*$scope.caleffectsize.corr*$scope.caleffectsize.sd1*$scope.caleffectsize.sd2))
   }else if($.inArray($scope.test.groups, ["multiple paired groups","multiple independent groups"]) > -1){
     $scope.numofeffectsizes = numofeffectsizes;
     means = [];
     for(ii=1;ii<numofeffectsizes+1;ii++){
       means.push($scope.caleffectsize["mean"+ii])
     }
     globalmean = meanFunction(means)
     meandiffssq = [];
     for(ii=1;ii<numofeffectsizes+1;ii++){
       meandiffssq.push(Math.pow($scope.caleffectsize["mean"+ii] - globalmean,2))
     }
     sigma_mu = Math.sqrt(meanFunction(meandiffssq))
     sds = [];
     for(ii=1;ii<numofeffectsizes+1;ii++){
       sds.push($scope.caleffectsize["sd"+ii])
     }
     pooled_variance = meanFunction(sds)
     $scope.effectsizevalue = Number(sigma_mu/pooled_variance)
   }else{
     $scope.effectsizevalue = Number(Math.sqrt($scope.caleffectsize.varianceexplained/$scope.caleffectsize.totalvariance))
   }
  }

})


app.directive("addeffectsizes", function($compile){
  	return function(scope, element, attrs){
  		element.bind("click", function(){
  		  numofeffectsizes++;
  			angular.element(document.getElementById('addedeffectsized_samplesize'))
  			.append($compile('<div class="row" id=effectsizediv'+numofeffectsizes+'><div class="col-lg-6"><label>Mean '+numofeffectsizes+'</label><input class="form-control" type="number" ng-model="caleffectsize.mean'+numofeffectsizes+'" ng-change="calculateeffectsize();"></div><div class="col-lg-6"><label>SD '+numofeffectsizes+'</label><input class="form-control" type="number" ng-model="caleffectsize.sd'+numofeffectsizes+'" ng-change="calculateeffectsize();" min=0></div></div>'
  			  )(scope));
  		});
  	};
  });

  app.directive("removeeffectsize", function($rootScope) {
      return {
            link:function(scope,element,attrs)
            {
                element.bind("click",function() {
                  var ele = angular.element( document.querySelector( '#effectsizediv'+ numofeffectsizes) );
                    ele.remove();
                    numofeffectsizes--;
                    scope.calculateeffectsize()
                });
            }
      };
  });




$(document).ready(function(){



})
