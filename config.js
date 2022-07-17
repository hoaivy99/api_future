var orderDetail = {
    price: 0,
    type: true,
    TP1: null,
    TP2: null,
    TP3: null,
    id: null,
    isReverse: false,
    priceSL: 0,
    timetamp: null,
}
const TP_DEFAULT = [{
    name: "TP1",
    value: 0.3,
}, {
    name: "TP2",
    value: 0.5,
}, {
    name: "TP3",
    value: 1,
}];
// var levelDetail = 
[{
    value: 0.25,
    timeEnd: null,
}, {
    value: 0.3,
    timeEnd: null,
}, {
    value: 0.4,
    timeEnd: null,
}, {
    value: 0.5,
    timeEnd: null,
}, {
    value: 0.6,
    timeEnd: null,
}, {
    value: 0.7,
    timeEnd: null,
}, {
    value: 0.8,
    timeEnd: null,
}];

const listDataFuture = ["TRXUSDT", "NEARUSDT", "AVAXUSDT", "ATOMUSDT", "FTMUSDT", "SOLUSDT", "SANDUSDT", "DOTUSDT","DYDXUSDT","ADAUSDT","XRPUSDT"];
const listDataFuture2 = ["FTTUSDT", "LTCUSDT", "ETCUSDT", "FILUSDT", "DOGEUSDT", "AXSUSDT", "MANAUSDT", "MATICUSDT","BCHUSDT"];



var bityardSymbol = ["XRPUSDT","DOTUSDT","LINKUSDT","ADAUSDT","ATOMUSDT","BCHUSDT","EOSUSDT","ETCUSDT","LTCUSDT",
"TRXUSDT","UNIUSDT","AAVEUSDT","AVAXUSDT","AXSUSDT","BANDUSDT","BATUSDT","CRVUSDT","DASHUSDT","DOGEUSDT","DYDXUSDT",
"FILUSDT","FTMUSDT","GRTUSDT","ICPUSDT","KAVAUSDT","KNCUSDT","KSMUSDT","LITUSDT","LUNAUSDT","MANAUSDT","MATICUSDT",
"MRKUSDT","NEARUSDT","OMGUSDT","RENUSDT","SANDUSDT","SHIBUSDT","SNXUSDT","SOLUSDT","SHUSHIUSDT","SXPUSDT","THETAUSDT",
"UNFIUSDT","XLMUSDT","XTZUSDT","YFIUSDT","ZRXUSDT"];


var listDataFutureCurrent = ["SOLUSDT","AVAXUSDT", "NEARUSDT","BCHUSDT","LTCUSDT","SANDUSDT","APEUSDT","DYDXUSDT","AXSUSDT","FTMUSDT","UNIUSDT"];

// "DOGEUSDT","DOTUSDT","FTMUSDT","MANAUSDT"


// "AVAXUSDT", "NEARUSDT", "SOLUSDT","TRXUSDT","SANDUSDT",",TRXUSDT  
// "LTCUSDT", "BCHUSDT"



module.exports = {
    orderDetail,
    listDataFuture,
    TP_DEFAULT,
    listDataFutureCurrent,
    listDataFuture2,
    bityardSymbol
}

// function getP() {
//     let TP = [20, 30, 50, 80, 100];
//     let SL = [10, 20, 30];


//     for (let index = 0; index < SL.length; index++) {
//         const _SL = SL[index];
//         console.log("=======", _SL, "======");
//         for (let i = 0; i < TP.length; i++) {
//             const _TP = TP[i];

//             console.log(_SL, _TP, (_TP - 10) / (_SL + 10));

//         }

//         console.log("=======");

//     }
// }
// getP();