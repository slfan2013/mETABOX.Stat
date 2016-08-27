var app = angular.module('app_univariateanalysis', []);
app.controller('ctrl_univariateanalysis', function($scope) {

})

$(document).ready(function(){
  $("#upload_univariateanalysis").on("click", upload)
})

function upload(){
  var req=ocpu.call("univariateanalysis_uploadfile",{
    file:$("upload_univariateanalysis")[0].files[0]
  },function(session){
    session.getObject(function(obj){
      e0=obj.expression;
      f0=obj.feature;
      p0=obj.phenotype;
    })
    session.getFile("warning.txt",function(text){
      alert(text);
    });
    session.getFile("success.txt",function(text){
      alert(text);
    })
  })
}
