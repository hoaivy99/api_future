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
    priceCurrent: {
        type: Number,
        required: true,
        index: true
    },
    timetampCurrent: {
        type: Number,
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true,
        index: true
    },
    quantity: {
        type: Number,
        required: true,
        index: true
    },
    rate: {
        type: Number,
        required: true,
        index: true
    },
    priceAfter: {
        type: Number,
        index: true
    },
    isProfit: {
        type: Boolean,
        index: true
    }
}, { timestamps: true });

const history_future = mongoose.model("history_future", schema);

module.exports = history_future;