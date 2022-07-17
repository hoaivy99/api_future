const got = require("got");

const { createServer } = require("http");
const { Server } = require("socket.io");
// const moment = require("moment");
const moment = require('moment-timezone');

const FormData = require('form-data');
const httpServer = createServer();
// const io = new Server(httpServer, { /* options */ });
const { getALL, getALLMoon, getALLBitYard,getALLBitYard2 } = require("./collections/future");
let form = new FormData();

const { listDataFuture, listDataFutureCurrent, listDataFuture2, bityardSymbol } = require('./config.js');


const account = [{
    //hoaivy.dev
    name: 'Account1',
    // token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDU2NDExMCIsImV4cCI6MTY1NzI4MDkwNywiaWF0IjoxNjU2Njc2MTA3fQ.dNGG7Ae1GCFxPM8qu9_LTL7EpGEQxMAy6xFZ4bSY1wk'
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDU2NDExMCIsImV4cCI6MTY1NzI4MDkwNywiaWF0IjoxNjU2Njc2MTA3fQ.dNGG7Ae1GCFxPM8qu9_LTL7EpGEQxMAy6xFZ4bSY1wk'
},
{
    //investment.9968
    name: 'Account2',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDEzNDQyNCIsImV4cCI6MTY1NzU1NzgxOSwiaWF0IjoxNjU2OTUzMDE5fQ.n1eyEHbEGqk6pvVQ3P86OQeeuuk9V1zY8oqTyVAnFBY'
},
{
    //khoahoc.fff02
    name: 'Account3',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDEzNjgwMyIsImV4cCI6MTY1ODMzNDc4NywiaWF0IjoxNjU3NzI5OTg3fQ.4jB7NhTUEujkBOK-1VxlUAW0OO9ePOksXCOZrW2Fflc'
},
{
    //vynguyen.fff
    name: 'Account4',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDEzOTY5OCIsImV4cCI6MTY1ODI0NDg3OSwiaWF0IjoxNjU3NjQwMDc5fQ.pcqXqDWlbBkn8f0WV9dbFXoDVUCeLDIIduh3hpJmZFk'
},
{
    //investment.6899
    name: 'Account5',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDE0MTcxNSIsImV4cCI6MTY1NzgwMTczNywiaWF0IjoxNjU3MTk2OTM3fQ.HlA5qrm-awwSAUWHRR7pfWU-kWMb172Wjt5fNGkHQeA',
    // token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDEzNDQyNCIsImV4cCI6MTY1NTgwNTEyNCwiaWF0IjoxNjU1MjAwMzI0fQ.lRoGlPw0usI1lRdzXTeF1UmtEuY6qqcZbenVIQxkz48'
},
{
    //stranger.moonxbt01
    name: 'Account6',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDU2NDExMCIsImV4cCI6MTY1Nzk4NzYxMywiaWF0IjoxNjU3MzgyODEzfQ.2Z8F5wFwg0yu705Oz4D78VA5QT_reA-5DqknewWDdG0'
},
{
    //stranger.moonxbt02
    name: 'Account7',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDE0NjY4MyIsImV4cCI6MTY1NzcyNjE4MSwiaWF0IjoxNjU3MTIxMzgxfQ.yqcHZgoUBKwom16YDi5g5AgAJuJ79R4-gPbkeVE57aU'
},
{
    //acquaintance.moonxbt01
    name: 'Account8',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDE0NjY4MyIsImV4cCI6MTY1NjgwNjE5NywiaWF0IjoxNjU2MjAxMzk3fQ.4CzFFta36VsMK_RjAOWWiQyDMrGy6ai82JRzIp1FAc4'
}
]



const getDataFromDB = async () => {

    const data = await getALL({
        createdAt: {
            $gte: moment('07/07/2022', "MM/DD/YYYY").toDate(),
            $lte: moment().toDate()
        }
    });
    let arr = [];
    let symbol_ = [];
    let SL = 0;
    let TP = 0;
    let win = 40;
    let loss = 40;
    console.log(data.data.length);

    listDataFutureCurrent.map((item) => {
        symbol_.push({
            symbol: item,
            SL: 0,
            TP: 0,
            count: 0,
            Percent: 0,
            Profit: 0
        })
    })


    for (let index = 0; index < data.data.length; index++) {
        const { profit, symbol, levelPrice, slValue, timeDifference, timetampFuture } = data.data[index];
        const { TPSL1, TPSL2, TPSL3, TPSL4, TPSL5, timetamp } = profit;
        const { TP1, TP2, TP3, TP4, TP5, TP6, TP7 } = TPSL3;
        // if (levelPrice < 0.3) continue;
        const findIndex = symbol_.findIndex(item => item.symbol == symbol);

        const time = timetampFuture.split(" ")[0];

        // console.log(time,'time');

        const _time = ['07/14/2022'];

        if (true) {
            if (findIndex !== -1) {
                if (levelPrice == 0.3) {
                    symbol_[findIndex].count += 1;

                    if (TP4 > 0) {
                        symbol_[findIndex].TP += 1;
                    } else {
                        symbol_[findIndex].SL += 1;
                    }

                    symbol_[findIndex].Profit = (symbol_[findIndex].TP * win) - (symbol_[findIndex].SL * loss);
                    symbol_[findIndex].Percent = (symbol_[findIndex].TP / (symbol_[findIndex].TP + symbol_[findIndex].SL)).toFixed(3);


                    if (TP4 > 0) {
                        TP += 1;
                    } else {
                        SL += 1;
                    }
                }
            }
        }





    }


    console.log(symbol_);
    console.log("TP:", TP, "SL:", SL, "Percent:", TP / (TP + SL));
    console.log("TOTAL:", TP + SL);
    console.log("Profit:", (TP * win) - (SL * loss));

}

const getDataFromBitYardDB = async () => {

    const data = await getALLBitYard({
        createdAt: {
            $gte: moment('07/10/2022', "MM/DD/YYYY").toDate(),
            $lte: moment().toDate()
        }
    });

    let arr = [];
    let symbol_ = [];
    let SL = 0;
    let TP = 0;
    let win = 90;
    let loss = 40;
    console.log(data.data.length);

    bityardSymbol.map((item) => {
        symbol_.push({
            symbol: item,
            SL: 0,
            TP: 0,
            count: 0,
            Percent: 0,
            Profit: 0
        })
    })


    for (let index = 0; index < data.data.length; index++) {
        const { profit, symbol, levelPrice, slValue, timeDifference, timetampFuture } = data.data[index];
        const { TPSL1, TPSL2, TPSL3, TPSL4, TPSL5, TPSL6, TPSL7, TPSL8, TPSL9, TPSL10, timetamp } = profit;
        const { TP1, TP2, TP3, TP4, TP5, TP6, TP7 } = TPSL4;
        // if (levelPrice < 0.3) continue;
        const findIndex = symbol_.findIndex(item => item.symbol == symbol);

        const time = timetampFuture.split(" ")[0];

        // console.log(time,'time');
        const _time = ['07/11/2022'];
        // _time.find(item => item === time)

        if (true) {
            if (timetamp) {
                if (findIndex !== -1) {
                    if (levelPrice == 0.3) {
                        symbol_[findIndex].count += 1;

                        if (TP6 > 0) {
                            symbol_[findIndex].TP += 1;
                        } else {
                            symbol_[findIndex].SL += 1;
                        }

                        symbol_[findIndex].Profit = (symbol_[findIndex].TP * win) - (symbol_[findIndex].SL * loss);
                        symbol_[findIndex].Percent = (symbol_[findIndex].TP / (symbol_[findIndex].TP + symbol_[findIndex].SL)).toFixed(3);


                        if (TP6 > 0) {
                            TP += 1;
                        } else {
                            SL += 1;
                        }
                    }
                }
            }
        }





    }


    console.log(symbol_);
    console.log("TP:", TP, "SL:", SL, "Percent:", TP / (TP + SL));
    console.log("TOTAL:", TP + SL);
    console.log("Profit:", (TP * win) - (SL * loss));

}

const getDataFromBitYardDB2 = async () => {
    const data = await getALLBitYard2({
        createdAt: {
            $gte: moment('07/10/2022', "MM/DD/YYYY").toDate(),
            $lte: moment().toDate()
        }
    });
    let arr = [];
    let symbol_ = [];
    let SL = 0;
    let TP = 0;
    let win = 90;
    let loss = 40;
    console.log(data.data.length);

    bityardSymbol.map((item) => {
        symbol_.push({
            symbol: item,
            SL: 0,
            TP: 0,
            count: 0,
            Percent: 0,
            Profit: 0
        })
    })


    for (let index = 0; index < data.data.length; index++) {
        const { profit, symbol, levelPrice, slValue, timeDifference, timetampFuture } = data.data[index];
        const { TPSL1, TPSL2, TPSL3, TPSL4, TPSL5, TPSL6, TPSL7, TPSL8, TPSL9, TPSL10, timetamp } = profit;
        const { TP1, TP2, TP3, TP4, TP5, TP6,TP7 } = TPSL4;
        // if (levelPrice < 0.3) continue;
        const findIndex = symbol_.findIndex(item => item.symbol == symbol);

        const time = timetampFuture.split(" ")[0];

        // console.log(time,'time');

        // const _time = ['07/09/2022'];

        if (true) {
            if (timetamp) {
                if (findIndex !== -1) {
                    if (levelPrice == 0.4) {
                        symbol_[findIndex].count += 1;

                        if (TP6 > 0) {
                            symbol_[findIndex].TP += 1;
                        } else {
                            symbol_[findIndex].SL += 1;
                        }

                        symbol_[findIndex].Profit = (symbol_[findIndex].TP * win) - (symbol_[findIndex].SL * loss);
                        symbol_[findIndex].Percent = (symbol_[findIndex].TP / (symbol_[findIndex].TP + symbol_[findIndex].SL)).toFixed(3);


                        if (TP6 > 0) {
                            TP += 1;
                        } else {
                            SL += 1;
                        }
                    }
                }
            }
        }





    }


    console.log(symbol_);
    console.log("TP:", TP, "SL:", SL, "Percent:", TP / (TP + SL));
    console.log("TOTAL:", TP + SL);
    console.log("Profit:", (TP * win) - (SL * loss));

}
function check(future, current) {
    return (((future - current) / current) * 100) < 0 ? -(((future - current) / current) * 100) : (((future - current) / current) * 100);
}
async function getResult(token, _time) {

    const res = await got.get(`https://www.moonxbt.com/cfd/app/history/list?token=${token}&pageNum=1&pageSize=100000`);
    const data = JSON.parse(res.body);
    console.log(data.datas.length);
    // return;
    let symbol_ = [];
    let win = 0;
    let loss = 0;
    let TP = 0;
    let SL = 0;
    let count = 0;
    let countSL = 0;
    let TPSpread = 0;
    let SLSpread = 0;
    let countNOData = 0;



    listDataFutureCurrent.map((item) => {
        symbol_.push({
            symbol: item,
            SL: 0,
            TP: 0,
            TPSpread: 0,
            SLSpread: 0,
            profit: 0,
            Percent: 0,
        })
    })


    await Promise.all(data.datas.slice(0, 100000).map(async (item) => {

        const { code, profit, currency, amount, charge, orderTime, strikePrice, overtime } = item;

        const time = orderTime?.split(" ")[0];
        const fee = +charge * 2;
        const findIndex = symbol_.findIndex(item => item.symbol == currency.toUpperCase());
        var result = null;


        if (_time.find(item => item === time)) {

            // if (currency.toUppexrCase() !== 'OPUSDT') console.log(profit, 'profit');


            const timeConvert = moment(orderTime).subtract(1, 'hours').format("MM/DD/YYYY hh:mm:ss");
            const timeConvert1 = moment(orderTime).subtract(1, 'hours').subtract(1, 'seconds').format("MM/DD/YYYY hh:mm:ss");
            const timeConvert2 = moment(orderTime).subtract(1, 'hours').subtract(2, 'seconds').format("MM/DD/YYYY hh:mm:ss");
            const timeConvert3 = moment(orderTime).subtract(1, 'hours').subtract(3, 'seconds').format("MM/DD/YYYY hh:mm:ss");
            const timeConvert4 = moment(orderTime).subtract(1, 'hours').subtract(4, 'seconds').format("MM/DD/YYYY hh:mm:ss");
            const timeConvert5 = moment(orderTime).subtract(1, 'hours').subtract(5, 'seconds').format("MM/DD/YYYY hh:mm:ss");


            const data = await Promise.all([
                getALLMoon({ symbol: currency.toUpperCase(), timetampFuture: timeConvert }),
                getALLMoon({ symbol: currency.toUpperCase(), timetampFuture: timeConvert1 }),
                getALLMoon({ symbol: currency.toUpperCase(), timetampFuture: timeConvert2 }),
                getALLMoon({ symbol: currency.toUpperCase(), timetampFuture: timeConvert3 }),
                getALLMoon({ symbol: currency.toUpperCase(), timetampFuture: timeConvert4 }),
                getALLMoon({ symbol: currency.toUpperCase(), timetampFuture: timeConvert5 })])



            data.map((item) => {
                if (item.data[0]) {
                    result = item.data[0];
                }
            })







            const priceOld = result?.priceOld;
            const rateBinance = result?.timetampFuture;

            // console.log(rateBinance,'rateBinance');
            // if(rateBinance >= 0.4){
            //     console.log(currency.toUpperCase());
            // }


            let ratePriceOld = null;

            if (priceOld) {
                ratePriceOld = check(strikePrice, priceOld)
            }

            if (ratePriceOld) {
                if (+ratePriceOld >= 0.15 || +ratePriceOld <= -0.15) {
                    countSL++;
                }
            }
            if (!result) { countNOData++ }





            if (findIndex !== -1) {
                count++;

                if (profit > 0) {
                    symbol_[findIndex].TP++;
                    symbol_[findIndex].profit += (profit - fee);
                    win += (profit - fee);
                    TP++;

                    if (ratePriceOld) {
                        if (+ratePriceOld >= 0.15) {
                            TPSpread++;
                            symbol_[findIndex].TPSpread++;
                        }
                    }



                } else {

                    symbol_[findIndex].SL++;
                    symbol_[findIndex].profit += (profit - fee);
                    loss += (profit - fee);
                    SL++;

                    if (ratePriceOld) {
                        if (+ratePriceOld >= 0.15) {
                            SLSpread++;
                            symbol_[findIndex].SLSpread++;
                        }
                    }



                }
                symbol_[findIndex].Percent = symbol_[findIndex].TP / symbol_[findIndex].SL;
            }
        }



    }))


    console.log(symbol_);
    console.log("Profit:", win + loss);
    console.log("TP:", TP, "SL:", SL);
    console.log("Spread", countSL);
    console.log("RateWin:", TP / count);
    console.log("RateSpread:", countSL / count);
    console.log("TPSpread", TPSpread);
    console.log("SLSpread", SLSpread);
    console.log("NoData", countNOData);
    console.log("Total:", count);
    console.log("========================");


}

async function getResultMoon(token, _time) {

    const res = await got.get(`https://www.moonxbt.com/cfd/app/history/list?token=${token}&pageNum=1&pageSize=100000`);
    const data = JSON.parse(res.body);
    console.log(data.datas.length);
    // return;
    let symbol_ = [];
    let win = 0;
    let loss = 0;
    let TP = 0;
    let SL = 0;
    let count = 0;
    let countSL = 0;
    let TPSpread = 0;
    let SLSpread = 0;
    let countNOData = 0;



    listDataFutureCurrent.map((item) => {
        symbol_.push({
            symbol: item,
            SL: 0,
            TP: 0,
            TPSpread: 0,
            SLSpread: 0,
            profit: 0,
            Percent: 0,
        })
    })


    await Promise.all(data.datas.slice(0, 100000).map(async (item) => {

        const { code, profit, currency, amount, charge, orderTime, strikePrice, overtime } = item;



        const time = orderTime?.split(" ")[0];

        const fee = +charge * 2;
        const findIndex = symbol_.findIndex(item => item.symbol == currency.toUpperCase());
        var result = null;


        if (_time.find(item => item === time)) {


            const timeConvert = moment(orderTime).subtract(1, 'hours').format("MM/DD/YYYY hh:mm:ss");
            const timeConvert1 = moment(orderTime).subtract(1, 'hours').subtract(1, 'seconds').format("MM/DD/YYYY hh:mm:ss");
            const timeConvert2 = moment(orderTime).subtract(1, 'hours').subtract(2, 'seconds').format("MM/DD/YYYY hh:mm:ss");
            const timeConvert3 = moment(orderTime).subtract(1, 'hours').subtract(3, 'seconds').format("MM/DD/YYYY hh:mm:ss");
            const timeConvert4 = moment(orderTime).subtract(1, 'hours').subtract(4, 'seconds').format("MM/DD/YYYY hh:mm:ss");
            const timeConvert5 = moment(orderTime).subtract(1, 'hours').subtract(5, 'seconds').format("MM/DD/YYYY hh:mm:ss");


            const data = await Promise.all([
                getALLMoon({ symbol: currency.toUpperCase(), timetampFuture: timeConvert }),
                getALLMoon({ symbol: currency.toUpperCase(), timetampFuture: timeConvert1 }),
                getALLMoon({ symbol: currency.toUpperCase(), timetampFuture: timeConvert2 }),
                getALLMoon({ symbol: currency.toUpperCase(), timetampFuture: timeConvert3 }),
                getALLMoon({ symbol: currency.toUpperCase(), timetampFuture: timeConvert4 }),
                getALLMoon({ symbol: currency.toUpperCase(), timetampFuture: timeConvert5 })])



            data.map((item) => {
                if (item.data[0]) {
                    result = item.data[0];
                }
            })

            const priceOld = result?.priceOld;
            const priceSellMoon = result?.priceSellMoon;
            const priceBuyMoon = result?.priceBuyMoon;
            const priceFuture = result?.priceFuture;
            const type = result?.type;




            let ratePriceOld = null;

            ratePriceOld = check(priceFuture, type ? priceBuyMoon : priceSellMoon)

            if (ratePriceOld) {

                if (+ratePriceOld <= 0.3) {
                    countSL++;
                }
            } else {
                countNOData++;
            }


            if (findIndex !== -1) {
                count++;

                if (profit > 0) {
                    symbol_[findIndex].TP++;
                    symbol_[findIndex].profit += (profit - fee);
                    win += (profit - fee);
                    TP++;

                    if (ratePriceOld) {
                        if (+ratePriceOld <= 0.3) {
                            TPSpread++;
                            symbol_[findIndex].TPSpread++;
                        }
                    }



                } else {
                    symbol_[findIndex].SL++;
                    symbol_[findIndex].profit += (profit - fee);
                    loss += (profit - fee);
                    SL++;

                    if (ratePriceOld) {
                        if (+ratePriceOld <= 0.3) {
                            SLSpread++;
                            symbol_[findIndex].SLSpread++;
                        }
                    }



                }
                symbol_[findIndex].Percent = symbol_[findIndex].TP / symbol_[findIndex].SL;
            }
        }



    }))


    console.log(symbol_);
    console.log("Profit:", win + loss);
    console.log("TP:", TP, "SL:", SL);
    console.log("Spread", countSL);
    console.log("RateWin:", TP / count);
    console.log("RateSpread:", countSL / count);
    console.log("TPSpread", TPSpread);
    console.log("SLSpread", SLSpread);
    console.log("NoData", countNOData);
    console.log("Total:", count);
    console.log("========================");


}
async function getDataWithdraw(token) {
    const res = await got.get(`https://www.moonxbt.com/account/app/capital/cwHistory?token=${token}&end=2022-12-25&pageNum=1&start=2022-03-22&type=2`);
    var total = 0;
    const data = JSON.parse(res.body);
    const list = data.data.capitalList;
    list.map((item) => {
        const amount = item.number;
        total += amount;
    })
    return total;
}

async function getDataDeposit(token) {
    const res = await got.get(`https://www.moonxbt.com/account/app/capital/cwHistory?token=${token}&end=2022-12-25&pageNum=1&start=2022-03-22&type=1`);
    var total = 0;
    const data = JSON.parse(res.body);
    const list = data.data.capitalList;
    list.map((item) => {
        const amount = item.number;
        total += amount;
    })
    return total;
}
async function getAllDataAccount() {
    const timez = ["2022-07-14"];

    // const timez = ["2022-06-13",'2022-06-12', "2022-06-11", "2022-06-10",
    //     "2022-06-09", "2022-06-08", "2022-06-07", "2022-06-06"];

    // const timez = ['2022-06-05', "2022-06-04", "2022-06-03",
    // "2022-06-02", "2022-06-01", "2022-05-31", "2022-05-30"];

    // await getResult(account[0].token, timez);
    // await getResult(account[1].token, timez);
    await getResult(account[2].token, timez); 
    // await getResult(account[3].token, timez);
    // await getResult(account[4].token, timez);
    // await getResult(account[5].token, timez);
    // await getResult(account[6].token, timez);
    // await getResult(account[7].token, timez);



    // await getResultMoon(account[0].token, timez);
    // await getResultMoon(account[1].token, timez);
    // await getResultMoon(account[2].token, timez);
    // await getResultMoon(account[3].token, timez);
    // await getResultMoon(account[4].token, timez);
    // await getResultMoon(account[5].token, timez);
    // await getResultMoon(account[6].token, timez);

    const cast = await getDataWithdraw(account[2].token);
    const deposit = await getDataDeposit(account[2].token);

    console.log('Deposit:', deposit);
    console.log('Castout:', cast);
    console.log('Profii',cast-deposit);



}

//15%
// getDataFromBitYardDB();
//0%
// getDataFromBitYardDB2();
// getDataFromDB();
// getAllDataAccount();
// console.log(check(7.1160,7.1129));
const PORT = process.env.PORT || 3000;




httpServer.listen(PORT);