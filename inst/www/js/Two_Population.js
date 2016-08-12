$(document).ready(function(){
  $("#samplesize_twopopulation").slider();
  $("#samplesize_twopopulation").on("slide", function(slideEvt) {
  	$("#samplesize_display_twopopulation").text(slideEvt.value);
  });

  $("#sampletimes_twopopulation").slider({
  });
    $("#sampletimes_twopopulation").on("slide", function(slideEvt) {
  	$("#sampletimes_display_twopopulation").text(slideEvt.value);
  });
})

