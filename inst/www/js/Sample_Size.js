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
  $scope.otherpara.numgroups1 = 3;
  $scope.otherpara.numgroups2 = 3;
  $scope.show = false;
  $scope.samplerange = "5-100,5";
  $scope.effectsizerange = "0.2,0.5,0.8"


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

  $scope.visualizeeffectsize=function(){

      if($scope.test.groups == "two independent groups"){
      $scope.effectsizevalue = Math.abs($scope.caleffectsize.mean1 - $scope.caleffectsize.mean2)/Math.sqrt((Number(Math.pow($scope.caleffectsize.sd1,2)) + Number(Math.pow($scope.caleffectsize.sd2,2)))/2)
    setTimeout(function(){
       var req = $("#visualizeeffectsize_samplesize").rplot("samplesize_visullizeeffectsize", {
          means:[$scope.caleffectsize.mean1,$scope.caleffectsize.mean2],sds:[$scope.caleffectsize.sd1,$scope.caleffectsize.sd2],effectsizevalue : $scope.effectsizevalue
        })
    }, 1000);


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

  $scope.calculatesamplesize=function(){
    document.getElementById("samplesize").innerHTML = '<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>'
    if($scope.test.groups == "two independent groups"){
      var req = ocpu.call("samplesize_onefactortwogroupspower",{
        effectsize:$scope.effectsizevalue,sig_level:$scope.alpha,power:$scope.power
      },function(session){
        session.getObject(function(obj){
          document.getElementById("samplesize").innerHTML = obj[0]
        })
      })
   }else if($scope.test.groups == "two paired groups"){
      var req = ocpu.call("samplesize_onefactortwopairedgroupspower",{
        effectsize:$scope.effectsizevalue,sig_level:$scope.alpha,power:$scope.power
      },function(session){
        session.getObject(function(obj){
          document.getElementById("samplesize").innerHTML = obj
        })
      })
   }else if($scope.test.groups == "multiple independent groups"){
      var req = ocpu.call("samplesize_onefactormultigroupspower",{
        k:$scope.otherpara.numgroups,effectsize:$scope.effectsizevalue,sig_level:$scope.alpha,power:$scope.power
      },function(session){
        session.getObject(function(obj){
          document.getElementById("samplesize").innerHTML = obj
        })
      })
   }else if($scope.test.groups == "multiple paired groups"){
      var req = ocpu.call("samplesize_onefactormultipairedgroupspower",{
        m:$scope.otherpara.numgroups,effectsize:$scope.effectsizevalue,sig_level:$scope.alpha,power:$scope.power,
        corr:$scope.otherpara.correlation,epsilon:$scope.otherpara.epsilon
      },function(session){
        session.getObject(function(obj){
          document.getElementById("samplesize").innerHTML = obj
        })
      })
   }else if($scope.test.groups == "independent*independent"){
     var req = ocpu.call("samplesize_twofactorindindpower",{
        k1:$scope.otherpara.numgroups1,k2:$scope.otherpara.numgroups2,effectsize:$scope.effectsizevalue,sig_level:$scope.alpha,power:$scope.power
      },function(session){
        session.getObject(function(obj){
          document.getElementById("samplesize").innerHTML = obj
        })
      })
   }else if($scope.test.groups == "independent*paired"){
     var req = ocpu.call("samplesize_twofactorindpairedpower",{
        k:$scope.otherpara.numgroups1,m:$scope.otherpara.numgroups2,effectsize:$scope.effectsizevalue,sig_level:$scope.alpha,power:$scope.power,
        corr:$scope.otherpara.correlation,epsilon:$scope.otherpara.epsilon
      },function(session){
        session.getObject(function(obj){
          document.getElementById("samplesize").innerHTML = obj
        })
      })
   }
  }




  $scope.toggleplot = function() {
          $scope.show = !$scope.show;
      };

  $scope.powersampleplot = function(){
  document.getElementById("samplesize").innerHTML = '<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>'
    if($scope.test.groups == "two independent groups"){
      var req = ocpu.call("samplesize_onefactortwogroupspower",{
        effectsize:$scope.effectsizevalue,sig_level:$scope.alpha,power:$scope.power,forplot:true,samplerange:$scope.samplerange,effectsizerange:$scope.effectsizerange
      },function(session){
        session.getObject(function(obj){
          data = obj[0]
          getchart(JSON.parse(data));
        })
      })
   }else if($scope.test.groups == "two paired groups"){
      var req = ocpu.call("samplesize_onefactortwopairedgroupspower",{
        effectsize:$scope.effectsizevalue,sig_level:$scope.alpha,power:$scope.power,forplot:true,samplerange:$scope.samplerange,effectsizerange:$scope.effectsizerange
      },function(session){
        session.getObject(function(obj){
          session.getObject(function(obj){
          data = obj[0]
          getchart(JSON.parse(data));
        })
        })
      })
   }else if($scope.test.groups == "multiple independent groups"){
      var req = ocpu.call("samplesize_onefactormultigroupspower",{
        k:$scope.otherpara.numgroups,effectsize:$scope.effectsizevalue,sig_level:$scope.alpha,power:$scope.power,forplot:true,samplerange:$scope.samplerange,effectsizerange:$scope.effectsizerange
      },function(session){
        session.getObject(function(obj){
          data = obj[0]
          getchart(JSON.parse(data));
        })
      })
   }else if($scope.test.groups == "multiple paired groups"){
      var req = ocpu.call("samplesize_onefactormultipairedgroupspower",{
        m:$scope.otherpara.numgroups,effectsize:$scope.effectsizevalue,sig_level:$scope.alpha,power:$scope.power,
        corr:$scope.otherpara.correlation,epsilon:$scope.otherpara.epsilon,forplot:true,samplerange:$scope.samplerange,effectsizerange:$scope.effectsizerange
      },function(session){
        session.getObject(function(obj){
          data = obj[0]
          getchart(JSON.parse(data));
        })
      })
   }else if($scope.test.groups == "independent*independent"){
     var req = ocpu.call("samplesize_twofactorindindpower",{
        k1:$scope.otherpara.numgroups1,k2:$scope.otherpara.numgroups2,effectsize:$scope.effectsizevalue,sig_level:$scope.alpha,power:$scope.power,forplot:true,samplerange:$scope.samplerange,effectsizerange:$scope.effectsizerange
      },function(session){
        session.getObject(function(obj){
          data = obj[0]
          getchart(JSON.parse(data));
        })
      })
   }else if($scope.test.groups == "independent*paired"){
     var req = ocpu.call("samplesize_twofactorindpairedpower",{
        k:$scope.otherpara.numgroups1,m:$scope.otherpara.numgroups2,effectsize:$scope.effectsizevalue,sig_level:$scope.alpha,power:$scope.power,
        corr:$scope.otherpara.correlation,epsilon:$scope.otherpara.epsilon,forplot:true,samplerange:$scope.samplerange,effectsizerange:$scope.effectsizerange
      },function(session){
        session.getObject(function(obj){
          data = obj[0]
          getchart(JSON.parse(data));
        })
      })
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
 $("#requestplot").click(function() {
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


getchart = function(d,l){
      var chart = new CanvasJS.Chart("chartContainer",
    {
      title:{
        text: "Power - Sample"
      },
      animationEnabled: true,
      axisY:{
        titleFontFamily: "arial",
        includeZero: false,
        maximum:1
      },
      toolTip: {
        shared: true
      },
      data: d,
      legend:{
        cursor:"pointer",
        itemclick:function(e){
          if(typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          	e.dataSeries.visible = false;
          }
          else {
          	e.dataSeries.visible = true;
          }
          chart.render();
        }
      }
    });
    setTimeout(function(){
       chart.render();
    }, 1000);
}






});

