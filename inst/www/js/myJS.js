  seq =  function(from, to, length) {
    result = [];

    if(from - to>0){ // from 1 to 0.
      for(var i=to; i<from+((from-to)/(length-1)); i=i+((from-to)/(length-1))) {
         result.push(i);
      }
      result.reverse();
    }else{
       for(var i=from; i<to+((to-from)/(length-1)); i=i+((to-from)/(length-1))) {
         result.push(i);
      }
    }
    return(result.slice(0, length))
  }
  dnorm = function(x,mean,sd){//require gaussian.js
    var distribution = gaussian(mean, Math.pow(sd, 2));
    var result = [];
    for(i=0;i<x.length;i++){
        result.push(distribution.pdf(x[i]))
    }
    return(result)
  }
  pnorm = function(q,mean,sd){//require gaussian.js
    var distribution = gaussian(mean, Math.pow(sd, 2));
    var result = [];
    for(i=0;i<q.length;i++){
        result.push(distribution.cdf(q[i]))
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
  qnorm = function(p, mean, sd){//require gaussian.js
    var distribution = gaussian(mean, Math.pow(sd, 2));
    var result = [];
    for(i=0;i<p.length;i++){
      result.push(distribution.cdf(p[i]))
    }
    return(result)
  }
  sumFunction = function(x,decimal = 2){
    var result = 0;
    for( var i = 0; i < x.length; i++ ){
      result += parseInt( x[i], 10 ); //don't forget to add the base
    }
    return(Number(result.toFixed(decimal)))
  }
  meanFunction = function(x,decimal = 2){
    var result = 0;
    for( var i = 0; i < x.length; i++ ){
      result += parseFloat( x[i], 10 ) //don't forget to add the base
    }
    result = result/(x.length)
    return(Number(result.toFixed(decimal)))
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







  function LogGamma(Z) {
  	with (Math) {
  		var S=1+76.18009173/Z-86.50532033/(Z+1)+24.01409822/(Z+2)-1.231739516/(Z+3)+.00120858003/(Z+4)-.00000536382/(Z+5);
  		var LG= (Z-.5)*log(Z+4.5)-(Z+4.5)+log(S*2.50662827465);
  	}
  	return LG
  }

  function Betinc(X,A,B) {
  	var A0=0;
  	var B0=1;
  	var A1=1;
  	var B1=1;
  	var M9=0;
  	var A2=0;
  	var C9;
  	while (Math.abs((A1-A2)/A1)>.00001) {
  		A2=A1;
  		C9=-(A+M9)*(A+B+M9)*X/(A+2*M9)/(A+2*M9+1);
  		A0=A1+C9*A0;
  		B0=B1+C9*B0;
  		M9=M9+1;
  		C9=M9*(B-M9)*X/(A+2*M9-1)/(A+2*M9);
  		A1=A0+C9*A1;
  		B1=B0+C9*B1;
  		A0=A0/B1;
  		B0=B0/B1;
  		A1=A1/B1;
  		B1=1;
  	}
  	return A1/A
  }

  function tprobability(df,X) {
      with (Math) {
  		if (df<=0) {
  			alert("Degrees of freedom must be positive")
  		} else {
  			A=df/2;
  			S=A+.5;
  			Z=df/(df+X*X);
  			BT=exp(LogGamma(S)-LogGamma(.5)-LogGamma(A)+A*log(Z)+.5*log(1-Z));
  			if (Z<(A+1)/(S+2)) {
  				betacdf=BT*Betinc(Z,A,.5)
  			} else {
  				betacdf=1-BT*Betinc(1-Z,.5,A)
  			}
  			if (X<0) {
  				tcdf=betacdf/2
  			} else {
  				tcdf=1-betacdf/2
  			}
  		}
  		tcdf=round(tcdf*100000)/100000;
  	}
      return(tcdf);
  }



  function countunique(arr) {
      var a = [], b = [], prev;

      arr.sort();
      for ( var i = 0; i < arr.length; i++ ) {
          if ( arr[i] !== prev ) {
              a.push(arr[i]);
              b.push(1);
          } else {
              b[b.length-1]++;
          }
          prev = arr[i];
      }

      return [a, b];
  }







function formatTableHeader(jsonData){
  var keyls = Object.keys(jsonData);//get list of keys
  var colnames = [];
  for (var i = 0; i < keyls.length; i++) {//table header = json keys
    colnames.push({title: keyls[i], data: keyls[i]});
  }
  return colnames;
}
function drawTable(id, data, filename,idSrc,tableheight="600px") {

$(id).empty();
	 table = $(id).DataTable( {
	   dom: 'Blfrtip',
		destroy: true,
		"scrollX": true,
		"scrollY": tableheight,
		"paging": false,
		fixedColumns: true,
		scrollCollapse: true,
    data: data,
		columns: formatTableHeader(data[0]),

		lengthChange: false,
		select:true,
       buttons: [
        {
            extend: 'csv',
            text: 'download',
			title: filename
        }
    ]
    } );
    return(table)
}





  //prototype.
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};


$(document).ready(function(){
  $("#test").click(function(){
    console.log("clicked")
        var req = ocpu.call("cat_function",{
    },function(session){
      console.log(session.getLoc())
    })
  })
})
