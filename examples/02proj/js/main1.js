
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

function init(){

  console.log("bbb----777---bbbbb");
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
          // center: [1318920722323.3445,3438773.456724345],
            //  center: [lat,lon],
              center: ol.proj.fromLonLat([109.864879, 39.151586]),
    //        center: ol.proj.fromLonLat([37.41, 8.82]),
          zoom: 15
        })
      });

  const openstreetMap = new ol.layer.Tile({
           source: new ol.source.OSM(),
           visible:true
        }) 

  const stamenterrain = new ol.layer.Tile({
           source: new ol.source.XYZ({
            url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg',
            attributions: 'For Toner and Terrain: Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL. <COPY HTML>'
           }),
           visible:true
        }) 


 // var mapExtent = ol.proj.transformExtent([109.758911, 39.045245, 109.970848, 39.257927], 'EPSG:4326', 'EPSG:3857');
  var mapMinZoom = 10;
  var mapMaxZoom = 25;
  var stamenterrain2 = new ol.layer.Tile({
  //  extent: mapExtent,
    source: new ol.source.XYZ({
      attributions: 'Rendered with <a href="https://www.maptiler.com/desktop/">MapTiler Desktop</a>',
      url: "http://127.0.0.1:8080/examples/tiler/{z}/{x}/{y}.png",
      tilePixelRatio: 1.00000000,
      minZoom: mapMinZoom,
      maxZoom: mapMaxZoom,
       visible:true
    })
  });

  map.addLayer(openstreetMap); //openstreetMap
  map.addLayer(stamenterrain2);
  
  console.log("bbb");
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

  map.addLayer(GeoJson);

  const loverlayContainerElm= document.querySelector('.overlay-container');
  const overyLayer = new ol.Overlay({
  	element:loverlayContainerElm
  })
  map.addOverlay(overyLayer);
  const overlayName = document.getElementById('feature-name');

  map.on('click',function(e){
     console.log(e.coordinate);
	overyLayer.setPosition(undefined);
     map.forEachFeatureAtPixel(e.pixel,function(feature,layer){
     	let corrdinate = e.coordinate;
console.log("ccccccccccc- aa");
     	let clickFeatureName=feature.get('name');
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
    