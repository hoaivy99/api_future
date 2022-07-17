const moment = require('moment');
const { getOne, getAll, insertOne, updateOne } = require("../config/mongo");
const history_future = require("../models/model_history_future");
const profit_logs = require("../models/model_profit_logs");


const insertHistory = async (obj) => insertOne(history_future, obj);

const insertProfitLogs = async (obj) => insertOne(profit_logs, obj);

const updateProfitLogs = async (filter, obj) => updateOne(profit_logs, filter, obj);

const getAllPairByStatus = async (filter) => {
    return getAll(list_pair_token, filter);
}


module.exports = {
    insertHistory,
    insertProfitLogs,
    updateProfitLogs,
    getAllPairByStatus
}