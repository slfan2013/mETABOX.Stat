#" univariateanalysis_twowayIndependentGroups
#"
#" stat
#" @param e2 = twowayIndependentGroups[[1]];f2=twowayIndependentGroups[[2]];p2=twowayIndependentGroups[[3]];
#" @keywords
#" @export
#" @examples
#" univariateanalysis_twowayIndependentGroups()

univariateanalysis_twowayIndependentGroups <- function(e2,f2,p2,
                                                      group1 = "treatment1",group2 = "treatment2",
                                                      para = T,
                                                      parainteraction = T,
                                                      paramaineffect = T,paramaineffectvariance=F,paramaineffectadj = "fdr",paramaineffectpost = "games.howell",
                                                      parasimplemaineffect = T,parasimplemaineffectvariance=F,parasimplemaineffectadj = "fdr",parasimplemaineffectpost = "games.howell",
                                                      paraposthoc = "games.howell",nonpara = T,nonpposthoc = "t test",nonpposthocadj="bonferroni",

                                                      # para = T;
                                                      # parainteraction = T;
                                                      # paramaineffect = T;paramaineffectvariance=F;paramaineffectadj = "fdr";paramaineffectpost = "games.howell";
                                                      # parasimplemaineffect = T;parasimplemaineffectvariance=F;parasimplemaineffectadj = "fdr";parasimplemaineffectpost = "games.howell";
                                                      # paraposthoc = "games.howell";nonpara = T;nonpposthoc = "t test";nonpposthocadj="bonferroni";



                                                      multicore = TRUE){
  library(parallel);library(userfriendlyscience);library(ez);library(jsonlite)
  if(multicore){
    cl = makeCluster(detectCores())
  }else{
    cl = makeCluster(1)
  }


  if(para){
    #interaction
    if(parainteraction){
     interaction = parSapply(cl,1:nrow(e2),function(j,e2,p2,group1,group2,ezANOVA){
       ezANOVA(data = data.frame(value=e2[j,],var1=p2[[group1]],var2=p2[[group2]],id=as.factor(p2[["ID"]])),
               dv = value, wid = id, between = .(var1,var2), type = 3)$ANOVA[3,5]
     },e2,p2,group1,group2,ezANOVA)
    }
    #main effect
    if(paramaineffect){
      # var1
      if(length(unique(p2[[group1]]))==2){
        paravar1main = parSapply(cl,1:nrow(e2),function(j,e2,p2,group1,group2,paramaineffectvariance){
          oneway.test(e2[j,] ~ as.factor(p2[[group1]]), var.equal = paramaineffectvariance)$p.value
        },e2,p2,group1,group2,paramaineffectvariance)
        paravar1main = rbind(paravar1main,adj = p.adjust(paravar1main,paramaineffectadj))
        rownames(paravar2main) = c(paste0("pvalue_para_ttest(",group1,")"),paste0("pvalue_para_ttest_adj(",group1,")"))
      }else{
        paravar1main = parSapply(cl,1:nrow(e2),function(j,e2,p2,group1,group2,paramaineffectvariance,posthocTGH,paramaineffectpost){
          paraANOVAposthoc = posthocTGH(e2[j,],as.factor(p2[[group1]]),digits = 4)$output[[paramaineffectpost]][,3]
          return(c(oneway.test(e2[j,] ~ as.factor(p2[[group1]]), var.equal = paramaineffectvariance)$p.value,paraANOVAposthoc))
        },e2,p2,group1,group2,paramaineffectvariance,posthocTGH,paramaineffectpost)
        rownames(paravar1main)[1] = paste0("pvalue_para_ANOVA(",group1,")")
        rownames(paravar1main)[2:nrow(paravar1main)] = paste0("pvalue_para_posthoc(",group1,")_",rownames(paravar1main)[-1])
      }
      # var2
      if(length(unique(p2[[group2]]))==2){
        paravar2main = parSapply(cl,1:nrow(e2),function(j,e2,p2,group1,group2,paramaineffectvariance){
          oneway.test(e2[j,] ~ as.factor(p2[[group2]]), var.equal = paramaineffectvariance)$p.value
        },e2,p2,group1,group2,paramaineffectvariance)
        paravar2main = rbind(paravar2main,adj = p.adjust(paravar2main,paramaineffectadj))
        rownames(paravar2main) = c(paste0("pvalue_para_ttest(",group2,")"),paste0("pvalue_para_ttest_adj(",group2,")"))
      }else{
        paravar2main = parSapply(cl,1:nrow(e2),function(j,e2,p2,group1,group2,paramaineffectvariance,posthocTGH,paramaineffectpost){
          paraANOVAposthoc = posthocTGH(e2[j,],as.factor(p2[[group2]]),digits = 4)$output[[paramaineffectpost]][,3]
          return(c(oneway.test(e2[j,] ~ as.factor(p2[[group2]]), var.equal = paramaineffectvariance)$p.value,paraANOVAposthoc))
        },e2,p2,group1,group2,paramaineffectvariance,posthocTGH,paramaineffectpost)
        rownames(paravar2main)[1] = paste0("pvalue_para_ANOVA(",group2,")")
        rownames(paravar2main)[2:nrow(paravar2main)] = paste0("pvalue_para_posthoc(",group2,")_",rownames(paravar2main)[-1])
      }
    }
    #simple main effect
    if(parasimplemaineffect){
      # var1
      if(length(unique(p2[[group1]]))==2){
        paravar1simplemain = by(p2,p2[[group2]],FUN=function(x){ # x=p2[p2[[group2]]==p2[[group2]][1],]
                                e=e2[,p2[[group2]]%in%x[[group2]]];p=x
                                paravar1simplemain = parSapply(cl,1:nrow(e),function(j,e,p,group1,group2,parasimplemaineffectvariance){
                                  oneway.test(e[j,] ~ as.factor(p[[group1]]), var.equal = parasimplemaineffectvariance)$p.value
                                },e,p,group1,group2,parasimplemaineffectvariance)
                                paravar1simplemain = rbind(paravar1simplemain,adj = p.adjust(paravar1simplemain,parasimplemaineffectadj))
                                rownames(paravar1simplemain) = c(paste0("pvalue_para_ttest(",p[[group2]][1],":",group1,")"),paste0("pvalue_para_ttest_adj(",p[[group2]][1],":",group1,")"))
                                return(paravar1simplemain)
                              })
      }else{
        paravar1simplemain = by(p2,p2[[group2]],FUN=function(x){ # x=p2[p2[[group2]]==p2[[group2]][1],]
          e=e2[,p2[[group2]]%in%x[[group2]]];p=x
          paravar1simplemain = parSapply(cl,1:nrow(e),function(j,e,p,group1,group2,parasimplemaineffectvariance,posthocTGH,parasimplemaineffectpost){
            oneway.test(e[j,] ~ as.factor(p[[group1]]), var.equal = parasimplemaineffectvariance)$p.value;
            paraANOVAposthoc = posthocTGH(e[j,],as.factor(p[[group1]]),digits = 4)$output[[parasimplemaineffectpost]][,3]
            return(c(oneway.test(e[j,] ~ as.factor(p[[group1]]), var.equal = parasimplemaineffectvariance)$p.value,paraANOVAposthoc))
          },e,p,group1,group2,parasimplemaineffectvariance,posthocTGH,parasimplemaineffectpost)
          rownames(paravar1simplemain)[1] = paste0("pvalue_para_ANOVA(",p[[group2]][1],":",group1,")")
          rownames(paravar1simplemain)[2:nrow(paravar1simplemain)] = paste0("pvalue_para_posthoc(",p[[group2]][1],":",group1,")_",rownames(paravar1simplemain)[-1])
          return(paravar1simplemain)
        })
      }
      # var2
      if(length(unique(p2[[group2]]))==2){
        paravar2simplemain = by(p2,p2[[group1]],FUN=function(x){ # x=p2[p2[[group2]]==p2[[group2]][1],]
          e=e2[,p2[[group1]]%in%x[[group1]]];p=x
          paravar2simplemain = parSapply(cl,1:nrow(e),function(j,e,p,group1,group2,parasimplemaineffectvariance){
            oneway.test(e[j,] ~ as.factor(p[[group2]]), var.equal = parasimplemaineffectvariance)$p.value
          },e,p,group1,group2,parasimplemaineffectvariance)
          paravar2simplemain = rbind(paravar2simplemain,adj = p.adjust(paravar2simplemain,parasimplemaineffectadj))
          rownames(paravar2simplemain) = c(paste0("pvalue_para_ttest(",p[[group1]][1],":",group2,")"),paste0("pvalue_para_ttest_adj(",p[[group1]][1],":",group2,")"))
          return(paravar2simplemain)
        })
      }else{
        paravar2simplemain = by(p2,p2[[group1]],FUN=function(x){ # x=p2[p2[[group2]]==p2[[group2]][1],]
          e=e2[,p2[[group1]]%in%x[[group1]]];p=x
          paravar2simplemain = parSapply(cl,1:nrow(e),function(j,e,p,group1,group2,parasimplemaineffectvariance,posthocTGH,parasimplemaineffectpost){
            oneway.test(e[j,] ~ as.factor(p[[group2]]), var.equal = parasimplemaineffectvariance)$p.value;
            paraANOVAposthoc = posthocTGH(e[j,],as.factor(p[[group2]]),digits = 4)$output[[parasimplemaineffectpost]][,3]
            return(c(oneway.test(e[j,] ~ as.factor(p[[group2]]), var.equal = parasimplemaineffectvariance)$p.value,paraANOVAposthoc))
          },e,p,group1,group2,parasimplemaineffectvariance,posthocTGH,parasimplemaineffectpost)
          rownames(paravar2simplemain)[1] = paste0("pvalue_para_ANOVA(",p[[group1]][1],":",group2,")")
          rownames(paravar2simplemain)[2:nrow(paravar2simplemain)] = paste0("pvalue_para_posthoc(",p[[group1]][1],":",group2,")_",rownames(paravar2simplemain)[-1])
          return(paravar2simplemain)
        })
      }
    }
  }

  parasubresult = t(rbind(interaction,paravar1main,paravar2main,do.call("rbind", paravar1simplemain),do.call("rbind", paravar2simplemain)))
  colnames(parasubresult)[1] = paste0("pvalue_para_interaction(",group1,"*",group2,")")

  result = matrix(NA,nrow = nrow(f2), ncol=ncol(parasubresult))
  result[!f2$missingremoved,] = parasubresult
  colnames(result) = colnames(parasubresult)

  # result = data.frame(f2,result,check.names = FALSE)
  # return(list(hypo_test_result=result,hypo_test_result_json=toJSON(result)))
  return(data.frame(f2,result,check.names = F))
}
