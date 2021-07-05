
// window.onload=init2;
// function init2(){
// 	$.ajax({
//         url: "data/count-data.json",
//         dataType: "json"
//     }).done(function (data) {
//         //console.log('Data: ', data);
//         rollNum("listedCompany", 0, data.listed_companies_total);//统计数据1
//         rollNum("listedSecurity", 0, data.listed_securities_total);
//         rollNum("totalMarket", 0, data.total_market_value, 2);
//         rollNum("circulationMarket", 0, data.circulation_market_value, 2);
//         rollNum("shRatio", 0, data.sh_pe_ratio, 2);
//         rollNum("szRatio", 0, data.sz_pe_ratio, 2);
//     }).fail(function (jqXHR, textStatus) {
//         console.log("Ajax Error: ", textStatus);
//     });
// }