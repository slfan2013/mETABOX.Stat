$(document).ready(function(){
  $("#test").click(function(){
        var req = ocpu.call("hello",{
    },function(session){
      console.log(session.getLoc())
    })
  })
})
