#' univariateanalysis_twoIndependentGroups
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' univariateanalysis_twoIndependentGroups()

univariateanalysis_twoIndependentGroups <- function(e2,f2,p2,
                              group1 = "treatment",
                              ttestpara = T,ttestparaadj = 'fdr',ttestequalvariance = F,ttestnonpara = T,ttestnonparaadj = 'fdr',

                              multicore = TRUE){
  library(parallel)
  if(multicore){
    cl = makeCluster(detectCores())
  }else{
    cl = makeCluster(1)
  }


  if(ttestpara){
    parattest = parSapply(cl=cl,X=1:nrow(e2),function(j,e2,p2,group1,ttestequalvariance){
      oneway.test(e2[j,] ~ p2[[group1]], var.equal = ttestequalvariance)$p.value
    },e2,p2,group1,ttestequalvariance)
    parattestadj = p.adjust(parattest,method = ttestparaadj)
  }else{parattest=NA;parattestadj=NA}
  if(ttestnonpara){
    nonparattest = parSapply(cl=cl,X=1:nrow(e2),function(j,e2,p2,group1,ttestequalvariance){
      wilcox.test(e2[j,] ~ p2[[group1]])$p.value
    },e2,p2,group1,ttestequalvariance)
    nonparattestadj = p.adjust(nonparattest,method = ttestnonparaadj)
  }else{nonparattest=NA;nonparattestadj=NA}

  result = matrix(NA,ncol = 4,nrow=nrow(f2))
  result[!f2$missingremoved,] = matrix(c(parattest,parattestadj,nonparattest,nonparattestadj),ncol = 4)

  #name.
  result = data.frame(f2,result,check.names = FALSE)
  colnames(result)[(ncol(result)-4+1):ncol(result)] = c(paste0("pvalue_para(",group1,")"),paste0("pvalue_para_adj(",group1,")"),
                                                        paste0("pvalue_nonpara(",group1,")"),paste0("pvalue_nonpara_adj(",group1,")"))


  means  = t(parSapply(cl,1:nrow(e2),function(j,e2,p2,group1){
    dta = data.frame(value = e2[j,],var1=p2[[group1]])
    return(aggregate(value~.,data=dta, mean)$value)
  },e2,p2,group1))
  means = data.frame(means,check.names = F)
  dta = data.frame(value = e2[1,],var1=p2[[group1]])
  temp.next = aggregate(value~.,data=dta, mean)
  temp.name = vector()
  for(i in 1:nrow(temp.next)){
    temp.name[i] = paste0("mean_",temp.next[i,1])
  }
  colnames(means) = temp.name


  sds  = t(parSapply(cl,1:nrow(e2),function(j,e2,p2,group1){
    dta = data.frame(value = e2[j,],var1=p2[[group1]])
    return(aggregate(value~.,data=dta, sd)$value)
  },e2,p2,group1))
  sds = data.frame(sds,check.names = F)
  dta = data.frame(value = e2[1,],var1=p2[[group1]])
  temp.next = aggregate(value~.,data=dta, sd)
  temp.name = vector()
  for(i in 1:nrow(temp.next)){
    temp.name[i] = paste0("sd_",temp.next[i,1])
  }
  colnames(sds) = temp.name

  result = data.frame(result,means,sds,check.names = F)

  colnames(result) = gsub("\\.", "_", colnames(result))
  result[is.na(result)] = ""
  return(result)
}
