// const { on } = require("gulp")

var lat=116.20;
var lon=39.3;
$(".site-demo-active").click(fun);
  
function fun(){
   var url = this.dataset.url;
   // console.log(url);
   posi=getQueryVariable(url);
   console.log(posi);
   // console.log(lat + " " + lon);
   lat = posi[1];
   lon = posi[3];
   console.log(lat + " 888 " + lon);
   initMap();
   
  }

  console.log(lat + " 888 " + lon);
// 获取数据的函数
function getQueryVariable(variable) {
  //  var query = window.location.search.substring(1);
  var query = variable.substring(8);
  console.log(query);
  var vars = query.split("&");
  console.log(vars);
  //  var pair;
  lat = vars[0].split("=");
  lon = vars[1].split("=");
  var pair = lat.concat(lon);
  return pair;
}


function initMap() {
     

     }