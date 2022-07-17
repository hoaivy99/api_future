const moment = require('moment');
const { getOne, getAll, insertOne, updateOne } = require("../../config/mongo"); 
const list_pair_token = require("../../models/model_list_pair_token");

const getPairToken = async (filter) => getOne(list_pair_token, filter);

const getListPairToken = async () => { 
    const today = moment().startOf('day');  
    const filter = {
        createdAt: {
            $gte: today.toDate(), 
            $lte: moment(today).endOf('day').toDate()
        }
    } 
   return getAll(list_pair_token, filter);
};

const insertPairToken = async (obj) => insertOne(list_pair_token, obj);

const updatePairToken = async (filter, obj) => updateOne(list_pair_token, filter, obj); 

const getAllPairByStatus = async (filter)=>{
    return getAll(list_pair_token, filter);  
}

const checkTimeUpdatedAt = async () => { 
    const startDay = moment().subtract(1,'years');  
    const endDay = moment().subtract(14, 'days');
    console.log(startDay.toDate(), endDay.toDate());
    const filter = {
        updateAt: {
            $gte: startDay.toDate(), 
            $lte: moment().toDate()
        }
    } 
   return getAll(list_pair_token, filter);
}; 

module.exports = {
    getPairToken,
    getListPairToken,
    updatePairToken,
    insertPairToken,
    checkTimeUpdatedAt,
    getAllPairByStatus
}