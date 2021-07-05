window.onload=init;
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       console.log("query11"+query);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
function init(){
  console.log("1aaaaaaaaaabb----222---aaaaaaaaaaaa");
  var lat = getQueryVariable("lat");
  var lon =getQueryVariable("lon");
  console.log(lat+" "+lon);
  var map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          // center: [1318920722323.3445,3438773.456724345],
              center: [lat,lon],
    //        center: ol.proj.fromLonLat([37.41, 8.82]),
          zoom: 15
        })
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

  map.addLayer(GeoJson);// 添加图层

  const loverlayContainerElm= document.querySelector('.overlay-container');
  const overyLayer = new ol.Overlay({
  	element:loverlayContainerElm
  })
  map.addOverlay(overyLayer);
  const overlayName = document.getElementById('feature-name');

  //展示点击位置的经纬度
  map.on('click',function(e){
      console.log(e.coordinate);
	    overyLayer.setPosition(undefined);
      map.forEachFeatureAtPixel(e.pixel,function(feature,layer){//点到栈格化数据就显示
     	let corrdinate = e.coordinate;
      console.log("ccccccccccc- aa");
     	let clickFeatureName=feature.get('name');//name就是我们设置的名字
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
    