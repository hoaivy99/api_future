const moment = require('moment');
const { getOne, getAll, insertOne, updateOne } = require("../config/mongo");
const history_future = require("../models/model_history_future");
const profit_logs = require("../models/model_profit_logs");
const log_bityard = require("../models/logs_bityard");
const log_bityard2 = require("../models/logs_bityard2");

const profit_logs_moonxbt = require("../models/logs_moon_order");


const insertHistory = async (obj) => insertOne(history_future, obj);
const insertProfitLogs = async (obj) => insertOne(profit_logs, obj);
const updateHistory = async (filter, obj) => updateOne(profit_logs, filter, obj);
const getALL = async (filter, obj) => getAll(profit_logs, filter);
const getALLBitYard = async (filter, obj) => getAll(log_bityard, filter);
const getALLBitYard2 = async (filter, obj) => getAll(log_bityard2, filter);
const getALLMoon = async (filter, obj) => getAll(profit_logs_moonxbt, filter);


const getAllPairByStatus = async (filter) => {
    return getAll(list_pair_token, filter);
}

module.exports = {
    insertHistory,
    insertProfitLogs,
    updateHistory,
    getAllPairByStatus,
    getALL,
    getALLMoon,
    getALLBitYard,
    getALLBitYard2
}