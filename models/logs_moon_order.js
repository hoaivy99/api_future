const mongoose = require("mongoose");

const schema = mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        index: true
    },
    priceOld: {
        type: Number,
        index: true
    },
    priceFuture: {
        type: Number,
        index: true
    },
    timetampOld: {
        type: String,
        index: true
    },
    timetampFuture: {
        type: String,
        index: true
    },
    rateBinance: {
        type: Number,
        index: true
    },
    rateMoon: {
        type: Number,
        index: true
    },
    priceSellMoon: {
        type: String,
        index: true
    },
    priceBuyMoon: {
        type: String,
        index: true
    },
}, { timestamps: true });

const profit_logs = mongoose.model("logs_moonxbt", schema);

module.exports = profit_logs;