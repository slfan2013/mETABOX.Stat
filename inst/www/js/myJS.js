$(document).ready(function(){
  $("#test").click(function(){
    console.log("clicked")
        var req = ocpu.call("cat_function",{
    },function(session){
      console.log(session.getLoc())
    })
  })

})
