const moment = require('moment');
const { getOne, getAll, insertOne, updateOne } = require("../../config/mongo");
const vy_pair = require("../../models/model_pair");

const getPairBot = async (filter) => getOne(vy_pair, filter);

const insertPairBot = async (obj) => {
    try {
        insertOne(vy_pair, obj);
    } catch (error) {
        console.log("error Insert");
    }
}


const updatePairBot = async (filter, obj) => updateOne(vy_pair, filter, obj);

const getAllPair = async (filter) => {
    return getAll(vy_pair, filter);
}

module.exports = {
    updatePairBot,
    insertPairBot,
    getPairBot,
    getAllPair,
}