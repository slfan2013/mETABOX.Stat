#' univariateanalysis_multiIndependentGroups
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' univariateanalysis_multiIndependentGroups()

univariateanalysis_multiIndependentGroups <- function(e2,f2,p2,
                                                    group1 = "treatment",
                                                    para = T,

                                                    paraposthoc = 'games.howell',equalvariance = F,nonpara = T,nonpposthoc = 't test',nonpposthocadj='bonferroni',

                                                    multicore = TRUE){
  library(parallel);library(userfriendlyscience)
  if(multicore){
    cl = makeCluster(detectCores())
  }else{
    cl = makeCluster(1)
  }


  if(para){
    paraANOVA = parSapply(cl=cl,X=1:nrow(e2),function(j,e2,p2,group1,equalvariance,posthocTGH,paraposthoc){
      paraANOVAposthoc = posthocTGH(e2[j,],as.factor(p2[[group1]]),digits = 4)$output[[paraposthoc]][,3]
      return(c(oneway.test(e2[j,] ~ as.factor(p2[[group1]]), var.equal = equalvariance)$p.value,paraANOVAposthoc))
    },e2,p2,group1,equalvariance,posthocTGH,paraposthoc)
  }else{paraANOVA=NA}

  if(nonpara){
    nonparaANOVA = parSapply(cl=cl,X=1:nrow(e2),function(j,e2,p2,group1){
      nonparaANOVAposthoc.temp = c(pairwise.t.test(e2[j,] , as.factor(p2[[group1]]),method = nonpposthocadj)$p.value)
      nonparaANOVAposthoc = nonparaANOVAposthoc.temp[!is.na(nonparaANOVAposthoc.temp)]
      return(c(kruskal.test(e2[j,] , as.factor(p2[[group1]]))$p.value,nonparaANOVAposthoc))
    },e2,p2,group1)
  }else{nonparaANOVA=NA}

  pararesult = matrix(NA,nrow = nrow(paraANOVA), ncol = nrow(f2))
  pararesult[,!f2$missingremoved] = paraANOVA


  nonpararesult = matrix(NA,nrow = nrow(nonparaANOVA), ncol = nrow(f2))
  nonpararesult[,!f2$missingremoved] = nonparaANOVA

  #names.
  pararesult = data.frame(t(pararesult),check.names = FALSE)
  colnames(pararesult) = c(paste0("pvalue_para(",group1,")"),paste("pvalue_para_posthoc:",
                               names(posthocTGH(e2[1,],as.factor(p2[[group1]]),digits = 4)$output[[paraposthoc]][,3])))

  nonpararesult = data.frame(t(nonpararesult),check.names = FALSE)
  o = pairwise.t.test(e2[1,] , as.factor(p2[[group1]]),method = nonpposthocadj)$p.value
  name = apply(expand.grid(rownames(o), colnames(o)), 1, paste, collapse=":")[!is.na(c(o))]
  colnames(nonpararesult) = c(paste0("pvalue_nonpara(",group1,")"),name)



  result = data.frame(f2,pararesult,nonpararesult)
  return(result)
}
