var missgroup = "no";

var app = angular.module('app_univariateanalysis', ["xeditable"]);
app.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});
app.controller('ctrl_univariateanalysis', function($scope) {
  $scope.tolmissingperc = 10;
  $scope.missingreplacemethod = "half minimum";
  $scope.missingreplacemethodgroup = "no";
  $scope.removemiss = true;
  $scope.missimpute = true;
  $scope.compoundName = "sudo";
  $scope.phenotypenames = [];
  $scope.featurenames = [];
  $scope.compound = {name:null};;
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

  $scope.submitupload = function(){
    $('#missingreplacemethodgroup_univariateanalysis').editable({
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
    var req=ocpu.call("univariateanalysis_numofmissing",{
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
        var chart = new CanvasJS.Chart("misingplot",{
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
            chart.render();
      })
    })
  }
  $scope.dealwithmissing = function(){
    var req = ocpu.call("univariateanalysis_dealwithmissing",{
      e:e0,f:f0,p:p0,missindex:$scope.missindex,removemiss:$scope.removemiss,
      miss_rate:$scope.miss_rate,tolmissingperc:$scope.tolmissingperc,
      missingreplacemethod:$scope.missingreplacemethod,missgroup:missgroup
    },function(sess){
      sess.getObject(function(obj){
        e1 = obj.e1;p1=obj.p1;f1=obj.f1;
      })
    })
  }

  $scope.applynormalization = function(){
    var req=ocpu.call("univariateanalysis_normalization",{
      e1:e1,f1:f1,p1:p1,
     samplewisenorm : $scope.samplewisenorm,samplewisenormindex:$scope.samplewisenormindex.value,
     transformation : $scope.transformation.value, loga : $scope.loga.value, logbase : $scope.logbase.value, power : $scope.power.value,
     scaling : $scope.scaling.value
    },function(sess){
      sess.getObject(function(obj){
        e2 = obj.e2;f2 = obj.f2;p2=obj.p2;
        $scope.drawPCA()
        })
    })
  }

  $scope.drawPCA = function(){
    var req = ocpu.call("univariateanalysis_PCA",{
      e2:e2,f2:f2,p2:p2
    },function(sess){
      sess.getObject(function(obj){
        Plotly.newPlot('PCAplot', JSON.parse(obj.data[0]), JSON.parse(obj.layout[0]));
      })
    })

  }




  $('#upload_univariateanalysis').change(upload);
  function upload(){
  var req=ocpu.call("univariateanalysis_uploadfile",{
    file:$("#upload_univariateanalysis")[0].files[0]
  },function(session){
    session.getObject(function(obj){
      e0=obj.expression;
      f0=obj.feature;
      p0=obj.phenotype;
      $scope.$apply(function(){
        $scope.compoundName = obj.compound_name[0];
        $scope.phenotypenames = obj.phenotypenames;
        $scope.featurenames = obj.featurenames;
      });
    })
  })
}

})


$(document).ready(function(){





$('#missingPerc_univariateanalysis').editable();
$('#missingreplacemethod_univariateanalysis').editable({
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



