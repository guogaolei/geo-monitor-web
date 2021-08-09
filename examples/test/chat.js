


function updateChat(arr1,arr2){


var dom = document.getElementById("container");

var myChart = echarts.init(dom);
var app = {};

var option;

    myChart.setOption(option = {
        title: {
            text: '水位',
            left: '1%'
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '5%',
            right: '15%',
            bottom: '30%'
        },
        xAxis: {

            data: arr1
        },
        yAxis: {
               
        },
        toolbox: {
            right: 22,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        },
        dataZoom: [{
             bottom: '17%',
            startValue: '2014-06-01'
        }, {
            type: 'inside'
        }],
        visualMap: {
            top: 50,
            right: 22,
            pieces: [{
                gt: 0,
                lte: 50,
                color: '#93CE07'
            }, {
                gt: 50,
                lte: 100,
                color: '#FBDB0F'
            }, {
                gt: 100,
                lte: 150,
                color: '#FC7D02'
            }, {
                gt: 150,
                lte: 200,
                color: '#FD0100'
            }, {
                gt: 200,
                lte: 300,
                color: '#AA069F'
            }, {
                gt: 300,
                color: '#AC3B2A'
            }],
            outOfRange: {
                color: '#999'
            }
        },
        series: {
            name: '水位',
            type: 'line',
            data: arr2,
            markLine: {
                silent: true,
                lineStyle: {
                    color: '#333'
                },
                data: [{
                    yAxis: 50
                }, {
                    yAxis: 100
                }, {
                    yAxis: 150
                }, {
                    yAxis: 200
                }, {
                    yAxis: 300
                }]
            }
        }
    });


    if (option && typeof option === 'object') {
        myChart.setOption(option);
    }

}


function getApiData(name){
	console.log("222131")
$.get( '/api/getwater_d/'+name, function (data) {
   updateChat(data.map(function (item) {return item[0];}),data.map(function (item) {return item[1];}))

});



}

 window.onload=function(){
 
	var Iframe=document.getElementById("mapobj");;//先获取到iframe元素
	var iframeWindow=(Iframe.contentWindow || Iframe.contentDocument);//获取到指定iframe下window

	console.log(iframeWindow) 
	iframeWindow.addEventListener("mapPointClick", e => {
		getApiData(e.detail.name);
	});

 };


 


  
 


