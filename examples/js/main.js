  
//Map from  ol.Map
//View from ol.View
// import {
//   DragAndDrop,                      ol.interaction.DragAndDrop 
//   defaults as defaultInteractions,  ol.interaction.defaults 
// } from 'ol/interaction';  
//import {ol.format.GPX., ol.format.GeoJSON , ol.format.KML } from '.ol.format';
// import {ol.layer.OSM, ol.layer.Vector as VectorSource} from 'ol.source.';
// import {ol.layer.Tile as TileLayer, ol.layer.Vector as VectorLayer} from 'ol.layer.';

const zip = new JSZip();
function getKMLData(buffer) {
  let kmlData;
  zip.load(buffer);
  const kmlFile = zip.file(/.kml$/i)[0];
  if (kmlFile) {
    kmlData = kmlFile.asText();
  }
  return kmlData;
}

function getKMLImage(href) {
  let url = href;
  let path = window.location.href;
  path = path.slice(0, path.lastIndexOf('/') + 1);
  if (href.indexOf(path) === 0) {
    const regexp = new RegExp(href.replace(path, '') + '$', 'i');
    const kmlFile = zip.file(regexp)[0];
    if (kmlFile) {
      url = URL.createObjectURL(new Blob([kmlFile.asArrayBuffer()]));
    }
  }
  return url;
}


class KMZ extends ol.format.KML {
  constructor(opt_options) {
    const options = opt_options || {};
    options.iconUrlFunction = getKMLImage;
    super(options);
  }

  getType() {
    return 'arraybuffer';
  }

  readFeature(source, options) {
    const kmlData = getKMLData(source);
    return super.readFeature(kmlData, options);
  }

  readFeatures(source, options) {
    const kmlData = getKMLData(source);
    return super.readFeatures(kmlData, options);
  }
}

// Set up map with Drag and Drop interaction
const dragAndDropInteraction = new ol.interaction.DragAndDrop({
    formatConstructors: [KMZ,  ol.format.GeoJSON , ol.format.KML ],
});


window.onload=init;

var tileSource = new ol.source.OSM();
var baseLayerGroup ;
function init(){

  console.log("bbb----444---bbbbb");
  var lat = GisHlpSingleton().getQueryVariable("lat");
  var lon = GisHlpSingleton().getQueryVariable("lon");
 
 
  var map = new ol.Map({
      interactions: ol.interaction.defaults().extend([dragAndDropInteraction]),
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

  dragAndDropInteraction.on('addfeatures', function (event) {
      const vectorSource = new ol.source.Vector({
        features: event.features,
      });

      map.addLayer(
        new ol.layer.Vector({
          source: vectorSource,
        })
      );

      map.getView().fit(vectorSource.getExtent());
});



  const openstreetMap = new ol.layer.Tile({
           source: tileSource,
           visible:true
        }) 

 // var mapExtent = ol.proj.transformExtent([109.758911, 39.045245, 109.970848, 39.257927], 'EPSG:4326', 'EPSG:3857');
  var mapMinZoom = 2;
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

 
  var vectorSource = new ol.source.Vector({
      url:'json/map.json',
      format:new ol.format.GeoJSON()
    })
 
  const GeoJson = new ol.layer.VectorImage({
     source: vectorSource,
     visible:true,
     title:'GeoJson',
     style: function (feature){
            return GisHlpSingleton().GeoJsonStyle(feature)
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

  GisHlpSingleton().touchOverLay.map = map;
  var featureOverlay = new ol.layer.Vector( GisHlpSingleton().touchOverLay);


  var highlight;
  var displayFeatureInfo = function (pixel) {
 
    baseLayerGroup.getLayers().item(2).getFeatures(pixel)
      .then(function (features) {
        var feature = features.length > 0 ? features[0] : undefined;

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


  
  function flash(feature) {

    var start = new Date().getTime();
    var listenerKey = baseLayerGroup.getLayers().item(1).on('postrender', animate); //overyLayer str1  
    function animate(event) {
      GisHlpSingleton().flashAnimate(event,feature,map,start,listenerKey) ;
    }

  }


  map.on('click',function(e){
     console.log(e.coordinate);

      x = ol.proj.fromLonLat([109.864879, 39.151586]);
      y = ol.proj.transform(e.coordinate,'EPSG:3857', 'EPSG:4326'  );
       console.log('click',y);

     xx = GisHlpSingleton().tileCoordinate(y,tileSource,this);
     zoom = this.getView().getZoom();
     console.log(xx[0],xx[1],zoom);

 
      overyLayer.setPosition(undefined);
      map.forEachFeatureAtPixel(e.pixel,function(feature,layer){
          GisHlpSingleton().featureInfo(e,overyLayer,overlayName,feature,layer);
          var geotype = feature.getGeometry().getType();
          if (geotype == 'Point' && feature )
          {

             let devid=feature.get('device-id');
              console.log(devid);
              let myEvent = new CustomEvent("mapPointClick", {
              detail: { name: devid }
              });

              window.dispatchEvent(myEvent);


             flash(feature)
          }  


     }),
     {
      layerFilter:function(corrdinate){
        console.log(corrdinate.get('title'))
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
