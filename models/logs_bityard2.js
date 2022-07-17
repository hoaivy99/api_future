const mongoose = require("mongoose");

const schema = mongoose.Schema({
    makeId: {
        type: String,
        required: true,
        index: true
    },
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
    levelPrice: {
        type: Number,
        required: true,
        index: true
    },
    profit: {
        type: Object,
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
    timeDifference: {
        type: String,
        index: true
    },
    rate: {
        type: Number,
        index: true
    },
    typeCall: {
        type: Number,
        required: true,
        index: true
    },
}, { timestamps: true });

const profit_logs = mongoose.model("history_logs_statistical_bityard_splip2", schema);

module.exports = profit_logs;