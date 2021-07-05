// const { on } = require("gulp")

window.onload = init;
function getQueryVariable(variable)
{
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
  // 02 统计数据
  $.ajax({
    url: "data/count-data.json",
    dataType: "json"
}).done(function (data) {
    //console.log('Data: ', data);
    rollNum("listedCompany", 0, data.listed_companies_total);//统计数据1
    rollNum("listedSecurity", 0, data.listed_securities_total);
    rollNum("totalMarket", 0, data.total_market_value, 2);
    rollNum("circulationMarket", 0, data.circulation_market_value, 2);
    rollNum("shRatio", 0, data.sh_pe_ratio, 2);
    rollNum("szRatio", 0, data.sz_pe_ratio, 2);
}).fail(function (jqXHR, textStatus) {
    console.log("Ajax Error: ", textStatus);
});

// 04
const dBChart = echarts.init(document.getElementById("chart04"));
var option;
option = {
  title: {
      text: "柱状图",
      left: "left",
      textStyle: {
        fontSize: 20,
        color:"#dddddd"
      }
  },
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: "bar",
    },
  ],
};
if (option && typeof option === "object") {
  dBChart.setOption(option);
}

// 06gis地图
  // console.log(2);
  console.log("1aaaaaaaaaabb----222---aaaaaaaaaaaa");
  var lat=1318920722323.3445;
  var lon=3438773.456724345;
$(".site-demo-active").click=fun;
function fun(){
  lat = getQueryVariable("lat");
  lon = getQueryVariable("lon");
  console.log(lat+"  "+lon);
  // console.log(this.);
}
  

   var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: [lat,lon],
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
   
      //  展示点击位置的经纬度
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
 