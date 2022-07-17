const mongoose = require("mongoose");

const URL = "mongodb+srv://tradedb:123qazzaq@cluster0.8wpb0.mongodb.net/test";
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log("err", err);
})


const insertMany = async (model, array = []) => {

    try {
        const result = await model.insertMany(array, { ordered: false });
        if (result.length !== 0) {
            return {
                status: "success",
                data: result
            };
        }
    } catch (error) {
        console.log("insertMany", error.message);
    }
    return {
        status: "error",
    };
}

const insertOne = async (model, obj = {}) => {
    try {
        const result = new model(obj);
        result.save();
        return {
            status: "success",
            data: result._id
        };
    } catch (error) {
        console.log("insertOne", error.message);
    }


    return {
        status: "error"
    };
}

const updateOne = async (model, _id, obj = {}) => {

    try {

        await model.updateOne(_id, obj)
        return {
            status: "success"
        };
    } catch (error) {
        console.log("updateOne", error.message);
    }
}

const getByQuery = async (model, query) => {
    try {
        const result = await model.find(query).lean();
        return {
            status: "success",
            data: result
        };
    } catch (error) {
        return {
            status: "error",
            msg: error.message
        };
    }
}

const getByLimit = async (model, query, sort, skip = 0, limit = 100) => {

    try {
        const result = await model.find(query).lean().skip(skip).limit(limit).sort({ createdAt: sort });
        return {
            status: "success",
            data: result
        };
    } catch (error) {
        return {
            status: "error",
            msg: error.message
        };
    }
}




const getOne = async (model, filter = {}) => {
    try {

        const result = await model.findOne(filter).lean();
        if (result) {
            return {
                status: "success",
                data: result
            };
        }
    } catch (error) {

    }

    return {
        status: "error"
    };
}

const getAllHistoryProfit = async (model, filter = {}, populate = "pairAddress", sort = { createdAt: "desc" }) => {

    try {
        const result = await model.find(filter).populate(populate).lean().sort(sort);
        return {
            status: "success",
            data: result
        };
    } catch (error) {

    }

    return {
        status: "error",
        data: null
    };
};


const getAll = async (model, filter = {}) => {
    try {
        const result = await model.find(filter).lean();
        if (result) {
            return {
                status: "success",
                data: result
            };
        }
    } catch (error) {
        return {
            status: "error",
            msg: error.message
        };
    }
    return {
        status: "error"
    };
}

module.exports = {
    insertOne,
    insertMany,
    updateOne,
    getOne,
    getAll,
    getByQuery,
    getByLimit,
    getAllHistoryProfit
}