#' univariateanalysis_PCA
#'
#' stat
#' @param
#' @keywords
#' @export
#' @examples
#' univariateanalysis_PCA()

univariateanalysis_PCA <- function(e2,f2,p2,
                                   color = "treatment",
                                   shape = "mx class id"){
  library(jsonlite)
  cols = univariateanalysis_gg_color_hue(length(unique(p2[[color]])))

  pca = prcomp(t(e2), center = F, scale. = F)
  score = pca$x
  score = data.frame(score,p2,check.names = FALSE)
  if(shape%in%colnames(p2)){
    score$shape = as.numeric(as.factor(p2[[shape]]))-1
  }else{
    score$shape = 0
  }

  # rownames(score) = rownames(e)
  variance = pca$sdev^2/sum(pca$sdev^2)

  scatter = by(score,p2[[color]],FUN=function(x){ # this is for the scatters.
    # x = score[p2[[color]]==p2[[color]][1],]
    text.temp = apply(x[colnames(p2)],1,function(o){
      paste(paste(colnames(p2),o, sep=": "),collapse = "</br>")
    })

    ellipse = tryCatch({
      ell.info <- cov.wt(cbind(x[,1], x[,2]))
      eigen.info <- eigen(ell.info$cov)
      lengths <- sqrt(eigen.info$values * 2 * qf(.95, 2, length(x[,1])-1))
      d = rbind(ell.info$center + lengths[1] * eigen.info$vectors[,1],
                ell.info$center - lengths[1] * eigen.info$vectors[,1],
                ell.info$center + lengths[2] * eigen.info$vectors[,2],
                ell.info$center - lengths[2] * eigen.info$vectors[,2])
      r <- cluster::ellipsoidhull(d)
      predict(r,100)
    },error = function(e){
      NULL
    })

    list(list(x = x[,1], y = x[,2]
              ,mode = 'markers',type='scatter'
              ,name = x[[color]][1]
              ,text = text.temp,showlegend=FALSE,
              marker=list(
                symbol = x$shape,
                color=x[[color]][1],
                size = 15,
                opacity=0.5)
    ),
    list(x = ellipse[,1], y = ellipse[,2] # this is for the ellipse.
         ,mode = 'lines',
         line= list(dash='solid',width=1)
         ,hoverinfo='none'
         ,name = x[[color]][1]
         ,showlegend=FALSE,opacity=0.5
    ))
  },simplify =F)

  data = list()
  for(i in 1:length(scatter)){
    data[[i]] = scatter[[i]][[1]]
    # data[[i]]$marker =  list(color = cols[i] , size = 18)
    data[[i+length(scatter)]] = scatter[[i]][[2]] # these are for the ellipse.
    data[[i+length(scatter)]]$marker =  list(color = cols[i])
  }

  layout = list(paper_bgcolor = "rgba(245,246,249,1)",
                 plot_bgcolor = "rgba(245,246,249,1)",
                 xaxis = list(
                   title = paste0("PC 1 (",round(variance[1],4) * 100,"%)"),
                   titlefont = list(
                     family="Courier New, monospace",
                     size = 18, color = "#7f7f7f"
                   )
                 ),
                 yaxis=list(
                   title = paste0("PC 2 (",round(variance[2],4) * 100,"%)"),
                   titlefont = list(
                     family="Courier New, monospace",
                     size = 18, color = "#7f7f7f"
                   )
                 ),
                 legend=list(
                   xanchor="auto"
                 )
  )

  data = jsonlite::toJSON(data,auto_unbox=T)
  layout = jsonlite::toJSON(layout,auto_unbox=T)
  return(list(data=data,layout=layout))
}
