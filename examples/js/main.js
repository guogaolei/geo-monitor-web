
window.onload=init;


function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

 
 function project(lnglat) {
  let x = [0, 0]; 
   let siny = Math.sin((lnglat[1] * Math.PI) / 180);
  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);
  
    x[0] = 256 * (0.5 + lnglat[0] / 360),
    x[1] = 256 * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
  return x;
}

function tileCoordinate(lnglat,tileSource,map){
    let x = [0, 0]; 
    x = project(lnglat);
   var tileUrlFunction = tileSource.getTileUrlFunction(),
    grid = tileSource.getTileGrid(),
    extent = map.getView().calculateExtent(map.getSize()),
    zoom = map.getView().getZoom();
   const scale = 1 << zoom;
    x[0] = Math.floor((x[0] * scale) / 256);
    x[1] = Math.floor((x[1] * scale) / 256);

    return x;
}

var tileSource = new ol.source.OSM();
var baseLayerGroup ;
function init(){

  console.log("bbb----444---bbbbb");
  var lat = getQueryVariable("lat");
  var lon =getQueryVariable("lon");
  console.log(lat+" "+lon);
 
    var map = new ol.Map({
  
        target: 'map',
        // layers: [
        //   new ol.layer.Tile({
        //     source: new ol.source.OSM()
        //   }) 
        // ],
        view: new ol.View({
          //  projection: 'EPSG:4326',
          // center: [1318920722323.3445,3438773.456724345],
            //  center: [lat,lon],
           center: ol.proj.fromLonLat([109.864879, 39.151586]),
    //        center: ol.proj.fromLonLat([37.41, 8.82]),
           zoom: 15
        })
      });

  const openstreetMap = new ol.layer.Tile({
           source: tileSource,
           visible:true
        }) 

  const stamenterrain = new ol.layer.Tile({
           source: new ol.source.XYZ({
            url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg' 
            
           }),
           visible:true
        }) 

 // var mapExtent = ol.proj.transformExtent([109.758911, 39.045245, 109.970848, 39.257927], 'EPSG:4326', 'EPSG:3857');
  var mapMinZoom = 1;
  var mapMaxZoom = 35;
  var stamenterrain2 = new ol.layer.Tile({
  //  extent: mapExtent,
    source: new ol.source.XYZ({
     
      url: "tiler/{z}/{x}/{y}.png",
      tilePixelRatio: 1.00000000,
      minZoom: mapMinZoom,
      maxZoom: mapMaxZoom,
       visible:true
    })
  });

    
 
    var tileUrlFunction = tileSource.getTileUrlFunction(),
      grid = tileSource.getTileGrid(),
      extent = map.getView().calculateExtent(map.getSize()),
     zoom = map.getView().getZoom();


    xx = tileCoordinate([109.864879, 39.151586],tileSource,map);
   console.log(xx[0],xx[1],zoom);
   // const scale = 1 << zoom;
   //  x1 = Math.floor((x[0] * scale) / 256);
   //  x2 = Math.floor((x[1] * scale) / 256);
   //  console.log(x);
   // console.log(x1,x2,zoom);
 

  grid.forEachTileCoord(extent, zoom, function (tileCoord) {
   // console.log(tileCoord)
   //  console.log(tileUrlFunction(tileCoord, 1, ol.proj.get('EPSG:3857')));
  });
  
 const fillstyle = new ol.style.Fill({
  color:[125,125,125,0.5]
 }) 

 const strokestyle =  new ol.style.Stroke({
  color:[85,85,85,1],
  width:1.2
 })

 const circlestyle = new ol.style.Circle({
  fill: new ol.style.Fill({
    color:[256,47,5,1]
  }),
  radius:7,
  stroke:strokestyle
  
 })

 
  var iconStyle = new ol.style.Icon({   src: 'ol/icon.png' });  //opacity: 0.5,



 
   
  var vectorSource = new ol.source.Vector({

      url:'json/map.json',
      format:new ol.format.GeoJSON()
    })
 
  const GeoJson = new ol.layer.VectorImage({
     source: vectorSource,
     visible:true,
     title:'GeoJson',
     style: function (feature) {
           
              var stroke =  feature.get('stroke');  
              var strokeW = feature.get('stroke-width');
              var strokeopacity = feature.get('stroke-opacity');
              var fillhexColor  = feature.get('fill');
              var fillopacity = feature.get('fill-opacity')

              var customtrokeStyle = strokestyle;
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

             var customFillstyle = fillstyle;
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
  })
  
  baseLayerGroup = new ol.layer.Group({
     layers:[openstreetMap,stamenterrain2,GeoJson]
  })
  map.addLayer(baseLayerGroup); //openstreetMap
 

  const loverlayContainerElm= document.querySelector('.overlay-container');
  const overyLayer = new ol.Overlay({
    element:loverlayContainerElm
  })
  map.addOverlay(overyLayer);
  const overlayName = document.getElementById('feature-name');


  var featureOverlay = new ol.layer.Vector({
    source: new ol.source.Vector,
    map: map,
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#f00',
        width: 1,
      }),
      fill: new ol.style.Fill({
        color: 'rgba(255,0,0,0.1)',
      }),
    }),
  });


  var highlight;
  var displayFeatureInfo = function (pixel) {
//str1
    baseLayerGroup.getLayers().item(3).getFeatures(pixel)
      .then(function (features) {
        var feature = features.length > 0 ? features[0] : undefined;

        // var info = document.getElementById('info');
        // if (feature) {
        //   info.innerHTML = feature.getId() + ': ' + feature.get('name');
        // } else {
        //   info.innerHTML = '  &nbsp;';
        // }

        if (feature !== highlight) {
          if (highlight) {
            featureOverlay.getSource().removeFeature(highlight);
          }
          if (feature) {
            featureOverlay.getSource().addFeature(feature);
          }
          highlight = feature;
        }
      });
  };

  map.on('pointermove', function (evt) {
    if (!evt.dragging) {
      displayFeatureInfo(evt.pixel);
    }
  });


  var duration = 3000;
  function flash(feature) {
  

    var start = new Date().getTime();

  // var listenerKey = baseLayerGroup.getLayers().item(1).on('postrender', animate); //overyLayer str1  

    function animate(event) {

    console.log('flash')
    var vectorContext = ol.render.getVectorContext(event);
    var frameState = event.frameState;
    var flashGeom = feature.getGeometry().clone();
    var elapsed = frameState.time - start;
    var elapsedRatio = elapsed / duration;
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

    if (elapsed > duration) {
      ol.Observable.unByKey(listenerKey);

      return;
    }
    // tell OpenLayers to continue postrender animation
    map.render();

    }

  }


  map.on('click',function(e){
     console.log(e.coordinate);



      x = ol.proj.fromLonLat([109.864879, 39.151586]);
  
  
      y = ol.proj.transform(e.coordinate,'EPSG:3857', 'EPSG:4326'  );
       console.log('click',y);

     xx = tileCoordinate(y,tileSource,this);
     zoom = this.getView().getZoom();
     console.log(xx[0],xx[1],zoom);


      //  px = map.getPixelFromCoordinate(e.corrdinate);
      // console.log(JSON.stringify(px));
      overyLayer.setPosition(undefined);
      map.forEachFeatureAtPixel(e.pixel,function(feature,layer){
      let corrdinate = e.coordinate;
           
      let clickFeatureName=feature.get('description');
    
      

      var geotype = feature.getGeometry().getType();
       if (geotype == 'Point'  )
       {
         flash(feature)
       }  

       if(undefined != clickFeatureName  ){
        overyLayer.setPosition(corrdinate);
         overlayName.innerHTML=clickFeatureName;
       }
     }),
     {
      layerFilter:function(corrdinate){
        return corrdinate.get('title') ==='GeoJson'
      }
     }

  })
}
    
 function switchMap(val) {
    // do.something;
    var lys =  baseLayerGroup.getLayers() ;
    lys.item(1).setVisible(val);
    
}
 
var instance;
function mapinit()
{
  console.log('mapinit',instance)
 
  if(instance == null){
     init();
     instance =1;
  }

}
