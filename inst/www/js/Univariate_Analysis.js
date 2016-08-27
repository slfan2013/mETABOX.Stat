
var app = angular.module('app_univariateanalysis', []);
app.controller('ctrl_univariateanalysis', function($scope) {
  $scope.tolmissingperc = 50;
  $scope.missingreplacemethod = "half minimum";
  $scope.missingreplacemethodgroup = "no";
  $scope.missstep1 = true;

  $scope.calnumberofmiss = function(){
    var req=ocpu.call("univariateanalysis_numofmissing",{
      e:e0,f:f0,p:p0,missindex:$scope.missindex
    },function(sess){
      sess.getObject(function(obj){
        document.getElementById("numofmiss").innerHTML = obj.numofmiss[0];
        document.getElementById("percofmiss").innerHTML = obj.percofmiss[0];
        if(obj.numofmiss[0]==0){
          $("#misstext").attr('class', 'text-success');
        }else{
          $("#misstext").attr('class', 'text-danger');
        }

      })
    })
  }



  function upload(){
  var req=ocpu.call("univariateanalysis_uploadfile",{
    file:$("#upload_univariateanalysis")[0].files[0]
  },function(session){
    session.getObject(function(obj){
      e0=obj.expression;
      f0=obj.feature;
      p0=obj.phenotype;
      $('#missingreplacemethodgroup_univariateanalysis').editable({
      source: obj.phenotypenames,
      display: function(value) {
        console.log(value)
        if(value===null || value.length===0){
          $(this).html("<span style='font-weight:normal;'>no</span>");
        }else{
          $(this).html("<span style='font-weight:normal;'>"+value+"</span>");
        }
      },
      select2: {
         multiple: true
      }
  });
      $scope.calnumberofmiss();
    })
  })
}


  $('#upload_univariateanalysis').change(upload);


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
$.fn.editable.defaults.mode = 'popup';
var e0;
var f0;
var p0;



