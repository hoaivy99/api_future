require("dotenv").config();
const express = require("express");
const app = express();
const createError = require("http-errors");
const helmet = require("helmet");
const cors = require("cors");
const moment = require("moment");
const crypto = require("crypto");
const got = require("got");
const { insertHistory,
    insertProfitLogs,
    updateHistory, getALL } = require("./collections/future");
const { listDataFuture, TP_DEFAULT } = require('./config.js');

const WebSocket = require('ws');

const { createServer } = require("http");
const { Server } = require("socket.io");


const httpServer = createServer();
const io = new Server(httpServer, { /* options */ });

const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(cors());
app.use(helmet());
app.use(express.json());

const ws = new WebSocket(`wss://stream.binance.com:9443/ws/btcusdt@trade/ltcusdt@trade/apeusdt@trade/
xrpusdt@trade/eosusdt@trade/trxusdt@trade/adausdt@trade/bchusdt@trade/etcusdt@trade/linkusdt@trade/
uniusdt@trade/aaveusdt@trade/filusdt@trade/dotusdt@trade/dydxusdt@trade/solusdt@trade/
lunausdt@trade/nearusdt@trade/ftmusdt@trade/atomusdt@trade/maticusdt@trade/manausdt@trade/sandusdt@trade/
avaxusdt@trade/fttusdt@trade/yfiusdt@trade`);


ws.onopen = function () {
    console.log("Binance connected...");
};

ws.onmessage = async function (evt) {
    try {
        // return;
        let msgs = JSON.parse(evt.data);


        const { s, p, m, T, q } = msgs;
        const symbol = s;
        const price = +p;
        const quantity = +q;
        const marketMaker = m;
        const timetamp = T;
        // Push array;
        push({
            symbol, timetamp, marketMaker, quantity, price
        })
        //====================
        // Find symbol
        const findIndex = listDataFuture.findIndex(item => item.symbol === symbol);
        const coinMain = listDataFuture[findIndex];
        //====================

        const order = isOrder(price, timetamp, symbol);
        if (!order) return;
        const { rate, isBuy, priceCurrent, timetampCurrent } = order;

        // if (symbol == 'APEUSDT' && rate >= 0.25) {
        //     console.log(symbol, rate, quantity, timetampCurrent);
        // }
        // const { rate, isBuy, priceCurrent, timetampCurrent } = order;
        //check BTC so voi cap tien...
        //===================
        //
        extractDataProfit(order, coinMain, findIndex, timetamp, symbol, price);
        orderMatch(findIndex, price, timetamp, symbol);
    } catch (e) {
        console.log('Unknown message: ' + evt.data, e);
    }
}
ws.onclose = function () {
    console.log("Binance disconnected");
}


let checkBack = [];

const push = (data) => {
    const { symbol, timetamp, marketMaker, quantity, price } = data;
    const findIndex = listDataFuture.findIndex(item => item.symbol === symbol);
    let tempData = listDataFuture[findIndex].data;
    if (tempData.length >= 1000) {
        tempData = tempData.slice(500, 1000);
        // console.log(symbol, 'Split');
    }
    tempData.push({
        timetamp,
        price
    })
    listDataFuture[findIndex].data = tempData;

}

const isOrder = (priceFuture, timetamp, symbol) => {
    let resultBreak = null;
    const findIndex = listDataFuture.findIndex(item => item.symbol === symbol);
    const listDataFutureReverse = listDataFuture[findIndex].data;
    const count = listDataFutureReverse.length - 1;
    for (let i = 0; i < listDataFutureReverse.length; i++) {
        if (timetamp - listDataFutureReverse[count - i].timetamp >= 700) {
            resultBreak = listDataFutureReverse[count - i]; 0
            break;
        }
    }
    if (!resultBreak) { return }
    // console.log(resultBreak, 'resultBreak', timetamp);
    let rate = ((priceFuture - (+resultBreak.price)) / +resultBreak.price) * 100;
    return {
        rate: rate >= 0 ? rate : -rate,
        priceCurrent: resultBreak.price,
        timetampCurrent: resultBreak.timetamp,
        priceFuture,
        isBuy: rate > 0,
    };
}

const getRate = (priceCurrent, priceFuture) => {
    return ((priceFuture - priceCurrent) / priceCurrent) * 100;
}

const extractDataProfit = async (order, coinMain, findIndex, timetamp, symbol, price) => {
    const listLevel = coinMain.level;
    const { rate, isBuy, priceCurrent, timetampCurrent } = order;

    // if(rate >= 0.2){
    //     console.log(rate,symbol);
    // }
    // console.log(rate,symbol,priceCurrent);


    for (let index = 0; index < listLevel.length; index++) {
        const levelValue = listLevel[index].value;
        const timeEnd = listLevel[index].timeEnd;

        const checkBackTrap = checkBack.find(item => item.symbol === symbol && item.timetamp + 5000 > timetamp && item.levelValue == levelValue);

        if (rate >= levelValue && timetamp >= (timeEnd + 1000 * 60 * 5) && !checkBackTrap) {
            checkBack.push({ symbol, timetamp, levelValue });
            console.log(moment().format('DD-MM-YYYY hh:mm:ss'));
            console.log(rate, isBuy, symbol, 'Logs');
            console.log("========================");
            ///Socket emit
            io.emit('socketFuture', {
                symbol,
                type: isBuy,
                priceCurrent,
                priceFuture: price,
                rate,
                timetampOld: moment.utc(moment.unix(timetampCurrent / 1000)).format('MM/DD/YYYY hh:mm:ss'),
                timetampCurrent: moment.utc(moment.unix(timetamp / 1000)).format('MM/DD/YYYY hh:mm:ss')
            })

            const dataInsert = await insertProfitLogs(
                {
                    symbol,
                    type: isBuy ? "LONG" : "SHORT",
                    levelPrice: levelValue,
                    TP1: 0,
                    TP2: 0,
                    TP3: 0,
                    SL: 0,
                    priceOld: priceCurrent,
                    priceFuture: price,
                    timetampOld: moment.utc(moment.unix(timetampCurrent / 1000)).format('MM/DD/YYYY hh:mm:ss'),
                    rate
                })

            if (dataInsert.status == 'success') {
                listDataFuture[findIndex].level[index].timeEnd = timetamp;
                const Id = dataInsert.data;
                let orderDetail = {};
                orderDetail.id = Id;
                orderDetail.price = price;
                orderDetail.type = isBuy;
                orderDetail.TP1 = null;
                orderDetail.TP2 = null;
                orderDetail.TP3 = null;
                orderDetail.isReverse = false;
                orderDetail.timetamp = timetamp;
                orderDetail.priceSL = 0;
                listDataFuture[findIndex].order.push(orderDetail)
            }
            break;
        }
    }

}

const orderMatch = (findIndex, priceSocket, timetampSocket, symbol) => {
    const listOrder = listDataFuture[findIndex].order;

    // Lặp lệnh đã khớp....
    // - nếu khớp TP3, order hoàn thành
    // - nếu khớp T1,T2 -> SL, order hoàn thành.
    // - NẾU SL, dừng trên >30s, <30s check lệnh TP/SL kèo ngược
    for (let index = 0; index < listOrder.length; index++) {
        const { type, isReverse, price, TP1, TP2, TP3, timetamp } = listOrder[index];
        const rateCurrent = getRate(price, priceSocket);
        const isMatchTP = TP1 || TP2 || TP3;
        // Lặp lệnh đã khớp....
        // - Đầu tiên check khớp TP1-2-3/SL
        // - Nếu SL chạy lệnh ngược lại ( hủy check TP)
        // - check Ngược lại TP/SL (profit = SL) // tp
        ///check lệnh đầu tiên
        if (!isReverse) {
            //check TP;
            for (let i = 0; i < TP_DEFAULT.length; i++) {
                if (type && rateCurrent >= TP_DEFAULT[i].value && !listOrder[index][TP_DEFAULT[i].name]) {
                    console.log(symbol, TP_DEFAULT[i].name, 'LONG', 'faster');
                    listDataFuture[findIndex].order[index][TP_DEFAULT[i].name] = priceSocket;
                    let objPost = {};

                    if (TP_DEFAULT[i].name == 'TP1') {
                        objPost['TP1'] = priceSocket;
                        objPost['timeTP1'] = moment.utc(moment.unix(timetampSocket / 1000)).format('MM/DD/YYYY hh:mm:ss');
                        objPost['checkProfit'] = true;

                    } else if (TP_DEFAULT[i].name == 'TP2') {
                        objPost['TP2'] = priceSocket;
                        objPost['timeTP2'] = moment.utc(moment.unix(timetampSocket / 1000)).format('MM/DD/YYYY hh:mm:ss');
                        objPost['checkProfit'] = true;

                    } else {
                        objPost['TP3'] = priceSocket;
                        objPost['timeTP3'] = moment.utc(moment.unix(timetampSocket / 1000)).format('MM/DD/YYYY hh:mm:ss');
                        objPost['isFinal'] = true;
                        objPost['checkProfit'] = true;
                        console.log('Done Order', symbol);
                    }

                    updateHistory({
                        _id: listDataFuture[findIndex].order[index].id,
                    }, objPost)

                    if (TP_DEFAULT[i].name == 'TP3') {
                        listDataFuture[findIndex].order.splice(index, 1);
                    }
                }

                if (!type && rateCurrent <= -(TP_DEFAULT[i].value) && !listOrder[index][TP_DEFAULT[i].name]) {
                    console.log(symbol, TP_DEFAULT[i].name, 'SHORT', 'faster');

                    let objPost = {};
                    listDataFuture[findIndex].order[index][TP_DEFAULT[i].name] = priceSocket;


                    if (TP_DEFAULT[i].name == 'TP1') {
                        objPost['TP1'] = priceSocket;
                        objPost['timeTP1'] = moment.utc(moment.unix(timetampSocket / 1000)).format('MM/DD/YYYY hh:mm:ss');
                        objPost['checkProfit'] = true;

                    } else if (TP_DEFAULT[i].name == 'TP2') {
                        objPost['TP2'] = priceSocket;
                        objPost['timeTP2'] = moment.utc(moment.unix(timetampSocket / 1000)).format('MM/DD/YYYY hh:mm:ss');
                        objPost['checkProfit'] = true;

                    } else {
                        objPost['TP3'] = priceSocket;
                        objPost['timeTP3'] = moment.utc(moment.unix(timetampSocket / 1000)).format('MM/DD/YYYY hh:mm:ss');
                        objPost['isFinal'] = true;
                        objPost['checkProfit'] = true;

                        console.log('Done Order', symbol);
                    }

                    updateHistory({
                        _id: listDataFuture[findIndex].order[index].id,
                    }, objPost)

                    if (TP_DEFAULT[i].name == 'TP3') {
                        listDataFuture[findIndex].order.splice(index, 1);
                    }
                }
            }


            // check SL
            // NẾU SL trong <30s chèn lệnh đánh ngược. 
            if (rateCurrent <= -0.2) {
                if (type) {

                    updateHistory({
                        _id: listDataFuture[findIndex].order[index].id,
                    }, {
                        SL: priceSocket,
                        timeSL: moment.utc(moment.unix(timetampSocket / 1000)).format('MM/DD/YYYY hh:mm:ss'),
                    })

                    if (isMatchTP) {
                        updateHistory({
                            _id: listDataFuture[findIndex].order[index].id,
                        }, {
                            isFinal: true,
                        })
                        listDataFuture[findIndex].order.splice(index, 1);


                    } else {
                        // SHORT quay đầu.
                        if (timetampSocket <= timetamp + 1000 * 30) {

                            console.log('SHORT quay đầu', symbol);
                            listDataFuture[findIndex].order[index].priceSL = priceSocket;
                            listDataFuture[findIndex].order[index].isReverse = true;

                        } else {

                            console.log('LONG SL, time quá 30s', symbol);
                            updateHistory({
                                _id: listDataFuture[findIndex].order[index].id,
                            }, {
                                checkProfit: false,
                                isFinal: true,
                            })
                            listDataFuture[findIndex].order.splice(index, 1);

                        }
                    }

                    console.log(symbol, 'SL LONG');


                }
            } else if (rateCurrent >= 0.2) {

                if (!type) {

                    updateHistory({
                        _id: listDataFuture[findIndex].order[index].id,
                    }, {
                        SL: priceSocket,
                        timeSL: moment.utc(moment.unix(timetampSocket / 1000)).format('MM/DD/YYYY hh:mm:ss'),
                    })

                    console.log(symbol, 'SL SHORT');
                    // LONG quay đầu.
                    if (isMatchTP) {
                        updateHistory({
                            _id: listDataFuture[findIndex].order[index].id,
                        }, {
                            isFinal: true,
                        })
                        listDataFuture[findIndex].order.splice(index, 1);

                    } else {
                        if (timetampSocket <= timetamp + 1000 * 30) {
                            console.log('LONG quay đầu', symbol);
                            listDataFuture[findIndex].order[index].priceSL = priceSocket;
                            listDataFuture[findIndex].order[index].isReverse = true;

                        } else {
                            console.log('SHORT SL, time quá 30s', symbol);
                            updateHistory({
                                _id: listDataFuture[findIndex].order[index].id,
                            }, {
                                checkProfit: false,
                                isFinal: true,
                            })
                            listDataFuture[findIndex].order.splice(index, 1);

                        }
                    }




                }
            }
        } else {
            //check đánh ngược chiều..
            const rateReverse = getRate(listDataFuture[findIndex].order[index].priceSL, priceSocket);
            if (!type) {
                if (rateReverse >= 0.3) {

                    updateHistory({
                        _id: listDataFuture[findIndex].order[index].id,
                    }, {
                        reverseTP: priceSocket,
                        timeReverseTP: moment.utc(moment.unix(timetampSocket / 1000)).format('MM/DD/YYYY hh:mm:ss'),
                        isOderReverse: true,
                        checkProfit: true,
                        isFinal: true,
                    })
                    console.log(symbol, 'TL LONG Reverse');
                    listDataFuture[findIndex].order.splice(index, 1);

                } else if (rateReverse <= - 0.2) {

                    updateHistory({
                        _id: listDataFuture[findIndex].order[index].id,
                    }, {
                        reverseSL: priceSocket,
                        timeReverseSL: moment.utc(moment.unix(timetampSocket / 1000)).format('MM/DD/YYYY hh:mm:ss'),
                        isOderReverse: true,
                        checkProfit: false,
                        isFinal: true,
                    })
                    listDataFuture[findIndex].order.splice(index, 1);

                    console.log(symbol, 'SL LONG Reverse');
                }
            } else {
                if (rateReverse <= -0.3) {

                    updateHistory({
                        _id: listDataFuture[findIndex].order[index].id,
                    }, {
                        reverseTP: priceSocket,
                        timeReverseTP: moment.utc(moment.unix(timetampSocket / 1000)).format('MM/DD/YYYY hh:mm:ss'),
                        isOderReverse: true,
                        checkProfit: true,
                        isFinal: true,
                    })
                    listDataFuture[findIndex].order.splice(index, 1);

                    console.log(symbol, 'TL SHORT Reverse');

                } else if (rateReverse >= 0.2) {

                    updateHistory({
                        _id: listDataFuture[findIndex].order[index].id,
                    }, {
                        reverseSL: priceSocket,
                        timeReverseSL: moment.utc(moment.unix(timetampSocket / 1000)).format('MM/DD/YYYY hh:mm:ss'),
                        isOderReverse: true,
                        checkProfit: false,
                        isFinal: true,
                    })

                    listDataFuture[findIndex].order.splice(index, 1);
                    console.log(symbol, 'SL SHORT Reverse');
                }
            }
        }
    }
}

io.on("connection", (socket) => {
    console.log(socket.id, 'socket');
    // ...
});
// const run = async () => {
//     const data = await getALL();
//     let arr = [];
//     let symbol = [];
//     listDataFuture.map((item) => {
//         symbol.push({
//             symbol: item.symbol,
//             SL: 0,
//             TP: 0,
//             count: 0,
//         })
//     })
//     for (let index = 0; index < data.data.length; index++) {
//         const element = data.data[index];
//         const findIndex = symbol.findIndex(item => item.symbol == element.symbol);
//         if (findIndex !== -1) {
//             symbol[findIndex].count += 1;
//             if (element.TP1 == 0) {
//                 symbol[findIndex].SL += 1;
//             } else {
//                 symbol[findIndex].TP += 1;
//             }
//         }

//     }

//     // console.log(arr.length);

//     console.log(symbol);
// }

// run()

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/socket', async (req, res) => {

    // console.log(a);
    res.send(arr)
})



httpServer.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})


