class GisHlp {
  
  constructor( ) {


  window.addEventListener("pingan", e => {
   //  alert(`pingan事件在gishlp.js触发，是 ${e.detail.name} 触发。`);
  });

    this.duration = 3000;

    this.strokestyle =  new ol.style.Stroke({
    color:[85,85,85,1],
    width:1.2
    });


      this.fillstyle = new ol.style.Fill({
    color:[125,125,125,0.5]
    }) ;


      this.circlestyle = new ol.style.Circle({
    fill: new ol.style.Fill({
    color:[256,47,5,1]
    }),
    radius:7,
    stroke:this.strokestyle
    })

    this.touchOverLay = {
      source: new ol.source.Vector,
    
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#f00',
          width: 1,
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255,0,0,0.1)',
        }),
      }),
    }

  }
 
  //获取坐标 GisHlpSingleton
  getQueryVariable(variable)
  {
         var query = window.location.search.substring(1);
         var vars = query.split("&");
         for (var i=0;i<vars.length;i++) {
                 var pair = vars[i].split("=");
                 if(pair[0] == variable){return pair[1];}
         }
         return(false);
  }



  //坐标转换
   project(lnglat) {
        let x = [0, 0]; 
       let siny = Math.sin((lnglat[1] * Math.PI) / 180);
      // Truncating to 0.9999 effectively limits latitude to 89.189. This is
      // about a third of a tile past the edge of the world tile.
        siny = Math.min(Math.max(siny, -0.9999), 0.9999);
      
        x[0] = 256 * (0.5 + lnglat[0] / 360),
        x[1] = 256 * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
      return x;
 }

   tileCoordinate(lnglat,tileSource,map){
    let x = [0, 0]; 
    x = GisHlpSingleton().project(lnglat);
   var tileUrlFunction = tileSource.getTileUrlFunction(),
    grid = tileSource.getTileGrid(),
    extent = map.getView().calculateExtent(map.getSize()),
    zoom = map.getView().getZoom();
   const scale = 1 << zoom;
    x[0] = Math.floor((x[0] * scale) / 256);
    x[1] = Math.floor((x[1] * scale) / 256);

    return x;
  }


  GeoJsonStyle(feature) {
           
              var stroke =  feature.get('stroke');  
              var strokeW = feature.get('stroke-width');
              var strokeopacity = feature.get('stroke-opacity');
              var fillhexColor  = feature.get('fill');
              var fillopacity = feature.get('fill-opacity')

              var customtrokeStyle = this.strokestyle;
             if(stroke != undefined && strokeopacity!= undefined && strokeW != undefined )
             {
                  stroke = ol.color.asArray(stroke);
                  stroke = stroke.slice();
                  stroke[3] =strokeopacity;  // change the alpha of the color
                   customtrokeStyle = new ol.style.Stroke({
                       color:stroke, 
                       width:strokeW
                  })  
             }

             var customFillstyle = this.fillstyle;
             if(fillhexColor != undefined && fillopacity != undefined)
             {
                fillhexColor = ol.color.asArray(fillhexColor);
                fillhexColor = fillhexColor.slice();
                fillhexColor[3] =fillopacity;  // change the alpha of the color
                customFillstyle = new ol.style.Fill({
                      color:fillhexColor
                 }) 
             }

            var geotype = feature.getGeometry().getType();
            var markercolor =  feature.get('marker-color');
            var iconStyle = new ol.style.Icon({   src: 'ol/icon.png' });  //opacity: 0.5,
            var customIcionstyle = iconStyle;
            if (geotype == 'Point' && markercolor != undefined)
            {
                  customIcionstyle = new ol.style.Icon({  scale: 0.7, color:markercolor, opacity:1, src: 'ol/icon.png' });  //opacity: 0.5,
            }
          
               return [new ol.style.Style({
                      fill:customFillstyle,
                      stroke:customtrokeStyle,
                       image:customIcionstyle  //circlestyle iconStyle
                       })
                     ];
       }


 
    flashAnimate(event,feature, _map,start,listenerKey) {

      
      var vectorContext = ol.render.getVectorContext(event);
      var frameState = event.frameState;
      var flashGeom = feature.getGeometry().clone();
      var elapsed = frameState.time - start;
      var elapsedRatio = elapsed / this.duration;
      var radius = ol.easing.easeOut(elapsedRatio) * 25 + 5;
      var opacity = ol.easing.easeOut(1 - elapsedRatio); 

      var style = new ol.style.Style({
        image: new ol.style.Circle({

          radius: radius,
          stroke: new ol.style.Stroke({
            color: 'rgba(255, 33, 32, ' + opacity + ')',
            width: 0.25 + opacity,
          }),
          zIndex: 2147483647,
        }),

        // image:new ol.style.Icon({ scale:radius,   opacity:opacity, src: 'ol/icon.png' })
      }); 

      vectorContext.setStyle(style);
      vectorContext.drawGeometry(flashGeom);

      if (elapsed > this.duration) {
        ol.Observable.unByKey(listenerKey);

        return;
      }
      // tell OpenLayers to continue postrender animation
      _map.render();

    }

    featureInfo(e,overyLayer,overlayName,feature,layer){
      let corrdinate = e.coordinate;
           
      let clickFeatureName=feature.get('description');
     
      var geotype = feature.getGeometry().getType();
       if (geotype == 'Point' && feature )
       {
         // flash(feature)
       }  

       if(undefined != clickFeatureName  ){
        overyLayer.setPosition(corrdinate);
         overlayName.innerHTML=clickFeatureName;
       }
     }



}

let _Singleton;

function GisHlpSingleton()
{

    if (!_Singleton  )
      _Singleton= new GisHlp();
    return _Singleton;

}

 
 