#' univariateanalysis_twoPairedGroups
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' univariateanalysis_twoPairedGroups()

univariateanalysis_twoPairedGroups <- function(e2,f2,p2,
                                                    group1 = "phenotype",
                                                    pairedttestpara = T,pairedttestparaadj = 'fdr',

                                                    pairedttestnonpara = T,pairedttestnonparaadj = 'fdr',

                                                    multicore = TRUE){
  library(parallel)
  if(multicore){
    cl = makeCluster(detectCores())
  }else{
    cl = makeCluster(1)
  }

  if(sum(duplicated(p2$ID))==0){
    stop("Error: If samples are different with each other (i.e. ID are idendical to each other), paired hypothesis testing cannot be proceed! Please correct the ID in the data processing tab.")
  }

  if(pairedttestpara){
    parapairedttest = parSapply(cl=cl,X=1:nrow(e2),function(j,e2,p2,group1){
      t.test(e2[j,] ~ p2[[group1]],paired = T)$p.value
    },e2,p2,group1)
    parapairedttestadj = p.adjust(parapairedttest,method = pairedttestparaadj)
  }else{parapairedttest=NA;parapairedttestadj=NA}
  if(pairedttestnonpara){
    nonparapairedttest = parSapply(cl=cl,X=1:nrow(e2),function(j,e2,p2,group1){
      wilcox.test(e2[j,] ~ p2[[group1]],paired=T)$p.value
    },e2,p2,group1)
    nonparapairedttestadj = p.adjust(nonparapairedttest,method = pairedttestnonparaadj)
  }else{nonparapairedttest=NA;nonparapairedttestadj=NA}

  result = matrix(NA,ncol = 4,nrow=nrow(f2))
  result[!f2$missingremoved,] = matrix(c(parapairedttest,parapairedttestadj,nonparapairedttest,nonparapairedttestadj),ncol = 4)

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
