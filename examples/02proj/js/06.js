// const { on } = require("gulp")

window.onload = init;
function getQueryVariable(variable) {
  //  var query = window.location.search.substring(1);
  // var query = $(".site-demo-active").data("url");
  // console.log(query);
  //  var vars = query.substring(8).split("&");
  //  for (var i=0;i<vars.length;i++) {
  //          var pair = vars[i].split("=");
  //          if(pair[0] == variable){return pair[1];}
  //  }
  //  return(false);
}
// console.log(lat + " " + lon);
// var lat = getQueryVariable("lat");
// var lon = getQueryVariable("lon");

function init() {
  // gis地图
  console.log("1aaaaaaaaaabb----222---aaaaaaaaaaaa");
  var lat = 1318920722323.3445;
  var lon = 3438773.456724345;
  $(".site-demo-active").click = fun;
  function fun() {
    lat = getQueryVariable("lat");
    lon = getQueryVariable("lon");
    console.log(lat + "  " + lon);
    // console.log(this.);
  }

  var map = new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      center: [lat, lon],
      zoom: 15,
    }),
  });

  const fillstyle = new ol.style.Fill({
    color: [84, 118, 255, 0.4],
  });

  const strokestyle = new ol.style.Stroke({
    color: [45, 45, 45, 1],
    width: 1.2,
  });

  const circlestyle = new ol.style.Circle({
    fill: new ol.style.Fill({
      color: [256, 47, 5, 1],
    }),
    radius: 7,
    stroke: strokestyle,
  });

  const GeoJson = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: "json/map.json",
      format: new ol.format.GeoJSON(),
    }),
    visible: true,
    title: "GeoJson",
    style: new ol.style.Style({
      fill: fillstyle,
      stroke: strokestyle,
      image: circlestyle,
    }),
  });

  map.addLayer(GeoJson); // 添加图层

  const loverlayContainerElm = document.querySelector(".overlay-container1");
  const overyLayer1 = new ol.Overlay({
    element: loverlayContainerElm,
  });
  map.addOverlay(overyLayer1);
  const overlayName1 = document.getElementById("feature-name1");

  //  展示点击位置的经纬度
  map.on("click", function (e) {
    console.log(e.coordinate);
    overyLayer1.setPosition(undefined);
    map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
      //点到栈格化数据就显示
      let corrdinate = e.coordinate;
      console.log("ccccccccccc- aa");
      let clickFeatureName = feature.get("name"); //name就是我们设置的名字
      console.log(feature, clickFeatureName);
      overyLayer1.setPosition(corrdinate);
      overlayName1.innerHTML = clickFeatureName;
    }),
      {
        layerFilter: function (corrdinate) {
          return corrdinate.get("title") === "GeoJson";
        },
      };
  });
}
