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
})

