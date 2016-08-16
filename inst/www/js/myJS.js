  seq =  function(from, to, length) {
    result = [];
    for(var i=from; i<to+((to-from)/(length-1)); i=i+((to-from)/(length-1))) {
         result.push(i);
      }
    return(result.slice(0, length))
  }
  pnorm = function(x,mean,sd){//require gaussian.js
    var distribution = gaussian(mean, Math.pow(sd, 2));
    var result = [];
    for(i=0;i<x.length;i++){
        result.push(distribution.pdf(x[i]))
    }
    return(result)
  }
  rnorm = function(n, mean, sd){//require gaussian.js
    var distribution = gaussian(mean, Math.pow(sd, 2));
    var result = [];
    for(i=0;i<n;i++){
      result.push(distribution.ppf(Math.random()))
    }
    return(result)
  }
  sumFunction = function(x,decimal = 2){
    var result = 0;
    for( var i = 0; i < x.length; i++ ){
      result += parseInt( x[i], 10 ); //don't forget to add the base
    }
    return(result.toFixed(decimal))
  }
  meanFunction = function(x,decimal = 2){
    var result = 0;
    for( var i = 0; i < x.length; i++ ){
      result += parseFloat( x[i], 10 ) //don't forget to add the base
    }
    result = result/(x.length)
    return(result.toFixed(decimal))
  }
  sdFunction = function(x,decimal = 2){
    var avg = meanFunction(x);
    var result = 0;
    var diff = [];
    for(var i=0; i<x.length; i++){
      diff.push(Math.pow((x[i] - avg),2));
    }
    return(Math.sqrt(Number((meanFunction(diff)))+0.01).toFixed(decimal))

  }
  storeItemAndReset = function(id){
    localStorage.setItem(id, $('#'+id).val());
    document.getElementById(id).value = localStorage.getItem(id);
  }
  qnorm = function(p,mean,sd){//require gaussian.js
    var distribution = gaussian(mean, Math.pow(sd, 2));
    var result = [];
    for(i=0;i<p.length;i++){
        result.push(distribution.ppf(p[i]))
    }
    return(result)
  }

  rep = function(value, len) {
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(value);
  }
  return arr;
}
  extractNumber = function(txt){
    var numb = txt.match(/\d/g);
    numb = numb.join("");
    return(parseFloat(numb))
  }


$(document).ready(function(){
  $("#test").click(function(){
    console.log("clicked")
        var req = ocpu.call("cat_function",{
    },function(session){
      console.log(session.getLoc())
    })
  })
})
