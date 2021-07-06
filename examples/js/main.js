
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
    console.log(tileCoord)
    console.log(tileUrlFunction(tileCoord, 1, ol.proj.get('EPSG:3857')));
  });
  
 const fillstyle = new ol.style.Fill({
  color:[84,118,255,0.4]
 }) 

 const strokestyle =  new ol.style.Stroke({
  color:[45,45,45,1],
  width:1.2
 })

 const circlestyle = new ol.style.Circle({
  fill: new ol.style.Fill({
    color:[256,47,5,1]
  }),
  radius:7,
  stroke:strokestyle
  
 })
   

  const GeoJson = new ol.layer.VectorImage({
    source: new ol.source.Vector({

      url:'json/map.json',
      format:new ol.format.GeoJSON()
    }),
    visible:true,
    title:'GeoJson',
    style: new ol.style.Style({
        fill:fillstyle,
       stroke:strokestyle,
       image:circlestyle
    })
  })

  
  baseLayerGroup = new ol.layer.Group({
     layers:[openstreetMap,stamenterrain2,GeoJson]
  })
  map.addLayer(baseLayerGroup); //openstreetMap
   
    console.log("ccc8");

 
   

  const loverlayContainerElm= document.querySelector('.overlay-container');
  const overyLayer = new ol.Overlay({
    element:loverlayContainerElm
  })
  map.addOverlay(overyLayer);
  const overlayName = document.getElementById('feature-name');

  map.on('click',function(e){
     console.log(e.coordinate);
          x = ol.proj.fromLonLat([109.864879, 39.151586]);
     console.log('222');
     console.log(x);
  
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
      console.log(feature,clickFeatureName);
      overyLayer.setPosition(corrdinate);

      overlayName.innerHTML=clickFeatureName;
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
