var missgroup = "no";
var event = [];
var appNorm = angular.module('app_norm', ["xeditable",'ngRoute']);
var subsetlevelscount = [];
var levelscount = [];
var continueuploadshow = false;

appNorm.run(function(editableOptions) {//MIGHT NOT BE USEFUL.
  editableOptions.theme = 'bs3';
});

appNorm.config(["$routeProvider","$locationProvider",function($routeProvider,$locationProvider){
  $routeProvider
		.when("/", {
			templateUrl: "Normalization.html",
			controller: "ctrl_norm"
		})
		.when("/Univariate_Analysis", {
			templateUrl: "Univariate_Analysis.html",
			controller: "ctrl_univariateanalysis"
		})
		;
}])

appNorm.controller('ctrl_norm', function($scope,srvShareData,$location) {
  {
    $scope.tolmissingperc = 10;
  $scope.missingreplacemethod = "half minimum";
  $scope.missingreplacemethodgroup = "no";
  $scope.removemiss = true;
  $scope.missimpute = true;
  $scope.compoundName = "sudo";
  $scope.sampleName = "sudo";
  $scope.phenotypenames = [];
  $scope.featurenames = [];
  $scope.compound = {name:null};
  $scope.sample = {name:null};
  $scope.numofmiss = [];
  $scope.percofmiss = [];
  $scope.miss_rate = [];
  $scope.samplewisenorm = 'none';
  $scope.transformation = {value:'none'};
  $scope.scaling = 'none';
  $scope.loga = {value:1};
  $scope.logbase = {value:2};
  $scope.power = {value:1/2};
  $scope.samplewisenormindex = {value:'none'};
  $scope.scaling = {value:'none'};
  }

$scope.dataToShare = [];
$scope.shareMyData = function (myValue) {
  $scope.dataToShare = myValue;
  srvShareData.addData($scope.dataToShare);
  window.location.href = "Univariate_Analysis.html";
}


  $scope.enablecontinueupload = function(){
    console.log($scope.compound.name);
    console.log($scope.sample.name)
    if($scope.compound.name&&$scope.sample.name){
      $scope.continueuploadshow = true
    }
  }
  $scope.submitupload = function(){
    $('#missingreplacemethodgroup_norm').editable({
      source: $scope.phenotypenames,
      display: function(value) {
        if(value===null || value.length===0){
          missgroup = "no";
          $(this).html("<span style='font-weight:normal;'>no</span>");
        }else{
          missgroup = value;
          $(this).html("<span style='font-weight:normal;'>"+value+"</span>");
        }
      },
      select2: {
         multiple: true
      }
    });
    $scope.calnumberofmiss();
  }

  $scope.calnumberofmiss = function(){
    var req=ocpu.call("normalization_numofmissing",{
      e:e0,f:f0,p:p0,missindex:$scope.missindex,compoundName:$scope.compound.name,tolmissingperc:$scope.tolmissingperc
    },function(sess){
      sess.getObject(function(obj){
        document.getElementById("numofmiss").innerHTML = obj.numofmiss[0];
        $scope.$apply(function(){$scope.numofmiss = obj.numofmiss[0]})
        document.getElementById("percofmiss").innerHTML = obj.percofmiss[0];
        $scope.$apply(function(){$scope.percofmiss = obj.percofmiss[0]});
        $scope.$apply(function(){$scope.miss_rate = obj.miss_rate})
        if(obj.numofmiss[0]==0){
          $("#misstext").attr('class', 'text-success');
        }else{
          $("#misstext").attr('class', 'text-danger');
        }

        var all = new CanvasJS.Chart("misingallplot",{
      			title:{
      				text: "Missing Rate of each compound",
      				fontSize: 20
      			},
            animationEnabled: true,
      			axisX: {
      				title:"Compound Name",
      				titleFontSize: 18
      			},
      			axisY:{
      				title: "Missing Rate",
      				titleFontSize: 16
      			},
      			legend: {
      				verticalAlign: 'bottom',
      				horizontalAlign: "center"
      			},
      			data: [
      			{
      				type: "scatter",
      				name: "Not to be removed",
      				markerType: "triangle",
      				showInLegend: true,
                      toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span><br/><strong> Compound:</strong> {label} <br/><strong> Missing Rate</strong></span> {y}%",

      				dataPoints: JSON.parse(obj.untolerable[0])
      			},
      			{
      				type: "scatter",
      				markerType: "square",
              toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span><br/><strong> Compound:</strong> {label} <br/><strong> Missing Rate</strong></span> {y}%",
      				name: "To be removed",
      				showInLegend: true,
      				dataPoints:JSON.parse(obj.tolerable[0])
      			}
      			],
            legend:{
                  cursor:"pointer",
                  itemclick : function(e) {
                    if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                      e.dataSeries.visible = false;
                    }
                    else {
                      e.dataSeries.visible = true;
                    }
                    chart.render();
                  }
                }
		});
          all.render();
    		var missing = new CanvasJS.Chart("misingonlymissingplot", {
            	title:{
            		text:"Compounds with missing value"
            	},
              animationEnabled: true,
            	axisX:{
            		interval: 1,
            		gridThickness: 0,
            		labelFontSize: 10,
            		labelFontStyle: "normal",
            		labelFontWeight: "normal",
            		labelFontFamily: "Lucida Sans Unicode"
            	},
            	axisY2:{
            		interlacedColor: "rgba(1,77,101,.2)",
            		gridColor: "rgba(1,77,101,.1)"
            	},
            	data: [
              	{
              		type: "bar",name: "compounds",axisYType: "secondary",color: "#014D65",
              		dataPoints: JSON.parse(obj.missing[0])
              	}
            	]
          });
          missing.render();
      })

    }).always(function(){$('#mytabs a[href="#dealwithmissingvalue-pills"]').tab('show');})
  }
  $scope.dealwithmissing = function(){
    var req = ocpu.call("normalization_dealwithmissing",{
      e:e0,f:f0,p:p0,missindex:$scope.missindex,removemiss:$scope.removemiss,
      miss_rate:$scope.miss_rate,tolmissingperc:$scope.tolmissingperc,
      missingreplacemethod:$scope.missingreplacemethod,missgroup:missgroup
    },function(sess){
      sess.getObject(function(obj){
        e1 = obj.e1;p1=obj.p1;f1=obj.f1;
      })
    }).always(function(){$('#mytabs a[href="#normalization-pills"]').tab('show');})
  }

  $scope.visualizenormalization = function(){
    var req=ocpu.call("normalization_normalization",{
      e1:e1,f1:f1,p1:p1,
     samplewisenorm : $scope.samplewisenorm,samplewisenormindex:$scope.samplewisenormindex.value,
     transformation : $scope.transformation.value, loga : $scope.loga.value, logbase : $scope.logbase.value, power : $scope.power.value,
     scaling : $scope.scaling.value
    },function(sess){
      sess.getObject(function(obj){
        e2 = obj.e2;f2 = obj.f2;p2=obj.p2;
        $scope.drawPCA();
        $scope.drawboxplots();
        })
    })
  }
  $scope.applynormalizationtoUni = function(){
    var req=ocpu.call("normalization_normalization",{
      e1:e1,f1:f1,p1:p1,
     samplewisenorm : $scope.samplewisenorm,samplewisenormindex:$scope.samplewisenormindex.value,
     transformation : $scope.transformation.value, loga : $scope.loga.value, logbase : $scope.logbase.value, power : $scope.power.value,
     scaling : $scope.scaling.value
    },function(sess){
      sess.getObject(function(obj){
        e2 = obj.e2;f2 = obj.f2;p2=obj.p2;
        $scope.shareMyData({e2:e2,f2:f2,p2:p2,phenotypenames:$scope.phenotypenames})
        })
    })
  }

  $scope.drawPCA = function(){
    var req = ocpu.call("normalization_PCA",{
      e2:e2,f2:f2,p2:p2
    },function(sess){
      sess.getObject(function(obj){
      PCAplot = document.getElementById('PCAplot');
      Plotly.newPlot(PCAplot, JSON.parse(obj.data[0]), JSON.parse(obj.layout[0]));

      PCAplot.on('plotly_selected',function(eventData){
        total = p2.map(function(ind){return ind['treatment']});
        temp1 = countunique(total);
        levelsnames = temp1[0];
        levelscount = temp1[1];
        selects = eventData.points;
        subsetofp2 = [];
        for(ii=0;ii < selects.length;ii++){
          if(selects[ii]["curveNumber"]==0){
            subsetofp2.push(p2[selects[ii]["pointNumber"]]);
          }else{
            subsetofp2.push(p2[Number(selects[ii]["pointNumber"]) + Number(selects[ii]["curveNumber"]) +
           Number(temp1[1].slice(0,Number(selects[ii]["curveNumber"])).reduce((a, b) => a + b, 0))-1]);
          }
        }
        subset = subsetofp2.map(function(ind){return ind['treatment']});
        temp2 = countunique(subset);
        subsetlevelsnames = temp2[0];
        subsetlevelscount = []
        for(ii=0;ii<levelscount.length;ii++){
          subsetlevelscount.push(levelscount[ii])
        }
        oo = 0
        for(ii=0;ii<subsetlevelscount.length;ii++){
          if($.inArray(levelsnames[ii], subsetlevelsnames)===-1){
            subsetlevelscount[ii] = 0;
          }else{
            subsetlevelscount[ii] = temp2[1][oo];oo++
          }
        }
        infodata = [];
        infodata.push({
          x:levelsnames,y:subsetlevelscount,name:"selected",type:'bar'
        })
        diff = [];for(ii=0;ii<levelscount.length;ii++){diff.push(levelscount[ii]-subsetlevelscount[ii])}
        infodata.push({
          x:levelsnames,y:diff,name:"total",type:"bar"
        })
        Plotly.newPlot('myDiv', infodata, {barmode: 'relative'});

      })
      })
    })

  }
  $scope.drawboxplots = function(){
    var req = ocpu.call("normalization_boxplots",{
      e2:e2,f2:f2,p2:p2,
      sampleName:$scope.sample.name
    },function(sess){
      sess.getObject(function(obj){
        BOXplots = Plotly.newPlot('BOXplots', JSON.parse(obj.data[0]), JSON.parse(obj.layout[0]));
      })
    })
  }

//dps.map(function(a) {return parseFloat(a.y);});


  $('#upload_norm').change(upload);
  function upload(){
  var req=ocpu.call("normalization_uploadfile",{
    file:$("#upload_norm")[0].files[0]
  },function(session){
    session.getObject(function(obj){
      e0=obj.expression;
      f0=obj.feature;
      p0=obj.phenotype;
      $scope.$apply(function(){
        $scope.compoundName = obj.compound_name[0];
        $scope.compound.name = obj.compound_name[0];
        $scope.sampleName = obj.sample_name[0];
        $scope.sample.name = obj.sample_name[0];
        $scope.phenotypenames = obj.phenotypenames;
        $scope.featurenames = obj.featurenames;
      });
    })
  })
}

})

appNorm.controller('ctrl_univariateanalysis',function($scope,srvShareData){
  $scope.dataexist = true;
  $scope.test = {groups :null}
  $scope.group = {first:null,second:null,
                  firstlength:null,secondlength:null,
                  firstmember:null,secondmember:null}
  $scope.sharedData = srvShareData.getData()[0];
  if($scope.sharedData.length === 0){
    $scope.dataexist = false
  }

  p2 = $scope.sharedData.p2

  $scope.summarygroup = function(){
        total = p2.map(function(ind){return ind['treatment']});
        temp1 = countunique(total);!!
  }


  console.log($scope.sharedData);
})



appNorm.service('srvShareData', function($window) {
        var KEY = 'appNorm.SelectedValue';
        var addData = function(newObj) {
            var mydata = $window.sessionStorage.getItem(KEY);
            if (mydata) {
                mydata = JSON.parse(mydata);
            } else {
                mydata = [];
            }
            mydata.push(newObj);
            $window.sessionStorage.setItem(KEY, JSON.stringify(mydata));
        };
        var getData = function(){
            var mydata = $window.sessionStorage.getItem(KEY);
            if (mydata) {
                mydata = JSON.parse(mydata);
            }
            return mydata || [];
        };
        return {
            addData: addData,
            getData: getData
        };
    });





$(document).ready(function(){




$('#missingPerc_norm').editable();
$('#missingreplacemethod_norm').editable({
        value: 'half minimum',
        source: [
              {value: 'half minimum', text: 'half minimum'},
              {value: 'minimum', text: 'minimum'},
              {value: 'mean', text: 'mean'},
              {value: 'median', text:'median'}
           ]
    });



})
//$.fn.editable.defaults.mode = 'popup';
var e0;
var f0;
var p0;



