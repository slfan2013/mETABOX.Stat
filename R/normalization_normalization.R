#' normalization_normalization
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' normalization_normalization()

normalization_normalization <- function(e1,f1,p1,
                                             samplewisenorm = 'mTIC',samplewisenormindex='knownornotknown',
                                             transformation = 'log', loga = 1, logbase = 2, power = 1/2,
                                             scaling = 'autoscaling'
                                             ){

  # samplewise normalization.
  if(samplewisenorm == 'none'){
    e1.1 = e1
  }else if(samplewisenorm == "mTIC"){
    sums = apply(e1[(f1[[samplewisenormindex]]=="known")[f1$missingremoved==FALSE],],2,sum)
    meansums = mean(sums)
    e1.1 = sweep(e1,MARGIN=2,(meansums/sums),`*`)
  }else if(samplewisenorm == "batcheffect"){
    batchmeans = apply(e1,1,function(x){
      by(x,p1[[samplewisenormindex]],mean)
    })
    batchMEAN = apply(batchmeans,2,mean)
    e1.1 = e1
    for(i in 1:nrow(e1)){
      for(name in rownames(batchmeans)){
        e1.1[i,p1[[samplewisenormindex]]==name] = e1.1[i,p1[[samplewisenormindex]]==name] * (batchMEAN[i]/batchmeans[,i][name])
      }
    }
  }else if(samplewisenorm == 'samplespecific'){
    e1.1 = sweep(e1,MARGIN=2,as.numeric(p1[[samplewisenormindex]]),`*`)
  }

  #transformation
  if(transformation == "none"){
    e1.2 = e1.1
  }else if(transformation == 'log'){
    e1.2  = log((0.5 * e1.1 + sqrt(e1.1^2 + loga^2)), base=logbase)
  }else if(transformation == "power"){
    e1.2 = e1.1^power
  }

  #scaling
  if(scaling == "none"){
    e1.3 = e1.2
  }else if(scaling == "meancentering"){
    e1.3 = t(scale(t(e1.2),scale=FALSE))
  }else if(scaling == "autoscaling"){
    e1.3 = t(scale(t(e1.2),scale=TRUE))
  }else if(scaling == "paretoscaling"){
    e1.3 = t(scale(t(e1.2),scale=FALSE))/sqrt(apply(e1.2,1,sd))
  }else if(scaling == "rangescaling"){
    e1.3 = t(scale(t(e1.2),scale=FALSE)) / apply(e1.2,1,function(x){diff(range(x))})
  }

  return(list(e2=e1.3,f2=f1,p2=p1))
}

