#' normalization_downloadnormalization
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' normalization_downloadnormalization()

normalization_downloadnormalization <- function(e1,f1,p1,
                                        samplewisenorm = 'mTIC',samplewisenormindex='knownornotknown',
                                        transformation = 'log', loga = 1, logbase = 2, power = 1/2,
                                        scaling = 'autoscaling'
){

  # samplewise normalization.
  if(samplewisenorm == 'none'){
    e1.1 = e1
    method = "Samplewise Normalization: none;"
  }else if(samplewisenorm == "mTIC"){
    sums = apply(e1[(f1[[samplewisenormindex]]=="known")[f1$missingremoved==FALSE],],2,sum)
    meansums = mean(sums)
    e1.1 = sweep(e1,MARGIN=2,(meansums/sums),`*`)
    method = paste0("Samplewise Normalization: mTIC (using ",samplewisenormindex,");")
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
    method = paste0("Samplewise Normalization: mTIC (using ",samplewisenormindex,");")
  }else if(samplewisenorm == 'samplespecific'){
    e1.1 = sweep(e1,MARGIN=2,as.numeric(p1[[samplewisenormindex]]),`*`)
    method = paste0("Samplewise Normalization: mTIC (using ",samplewisenormindex,");")
  }

  #transformation
  if(transformation == "none"){
    e1.2 = e1.1
    method = paste0(method," Data Transformation: none;")

  }else if(transformation == 'log'){
    e1.2  = log((0.5 * e1.1 + sqrt(e1.1^2 + loga^2)), base=logbase)
    method = paste0(method," Data Transformation: log (with base ",logbase," and constant ", loga,");")
  }else if(transformation == "power"){
    e1.2 = e1.1^power
    method = paste0(method," Data Transformation: log (with power ",power,");")
  }

  #scaling
  if(scaling == "none"){
    e1.3 = e1.2
    method = paste0(method," Data Scaling: none;")
  }else if(scaling == "meancentering"){
    e1.3 = t(scale(t(e1.2),scale=FALSE))
    method = paste0(method," Data Scaling: mean centering;")
  }else if(scaling == "autoscaling"){
    e1.3 = t(scale(t(e1.2),scale=TRUE))
    method = paste0(method," Data Scaling: auto scaling;")
  }else if(scaling == "paretoscaling"){
    e1.3 = t(scale(t(e1.2),scale=FALSE))/sqrt(apply(e1.2,1,sd))
    method = paste0(method," Data Scaling: Pareto scaling;")
  }else if(scaling == "rangescaling"){
    e1.3 = t(scale(t(e1.2),scale=FALSE)) / apply(e1.2,1,function(x){diff(range(x))})
    method = paste0(method," Data Scaling: Range scaling;")
  }
  e2=e1.3;f2=f1;p2=p1
  result = matrix(NA, nrow = ncol(p2)+nrow(f2),ncol = ncol(f2)+nrow(p2))
  result[1:ncol(p2),(ncol(f2)+1):ncol(result)] = t(p2)
  result[1:ncol(p2),ncol(f2)] = colnames(p2)

  result[(ncol(p2)+1):nrow(result),1:ncol(f2)] = as.matrix(f2)
  result[ncol(p2),1:ncol(f2)] = colnames(f2)

  result[(ncol(p2)+1):nrow(result),(ncol(f2)+1):ncol(result)][!f2$missingremoved,] = e2

  #normalization method.
  result= rbind(c(method,rep("",ncol(result)-1)),result)

  return(result)
}

