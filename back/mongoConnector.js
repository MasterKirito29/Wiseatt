const MongoClient = require('mongodb').MongoClient;
const Config = require('config');

const configmongo = Config.get("mongo");

const mongodb = {
    connectMongo: () => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(
                `mongodb://${configmongo.user}:${configmongo.password}@${configmongo.host}:59253/wisebatt`,
                (err, db) => {
                    if (!err) {
                        console.log("Database Mongo connected");
                    } else {
                        console.log("Error connecting database mongo", err);
                    }
                },
                (err, db) => (err ? reject(err) : resolve(db))
            );
        });
    },

    find: (collection, search, projection = {}, limit = 0, skip = 0, sort = {}) =>
        new Promise((resolve, reject) =>
            collection
                .find(search)
                .skip(skip)
                .sort(sort)
                .limit(limit)
                .project(projection)
                .toArray((err, res) => (err ? reject(err) : resolve(res)))
    ),

    insertOne: (collection, json, options = {}) =>
        new Promise((resolve, reject) =>
            collection.insertOne(json, options, (err, res) => (err ? reject(err) : resolve(res)))
    ),

    findOne: (collection, search) =>
        new Promise((resolve, reject) =>
        collection
            .find(search)
            .toArray((err, res) => (err ? reject(err) : resolve(res[0])))
    ),
    count: (collection, search, projection = {}, limit = 0, skip = 0, sort = {}) =>
        new Promise((resolve, reject) =>
            resolve(collection
                .find(search)
                .skip(skip)
                .sort(sort)
                .limit(limit)
                .project(projection)
                .count())
    ),
    updateOne: (collection, filter, update, options) =>
    new Promise((resolve, reject) => collection.updateOne(filter, update, options, (err, res) => (err ? reject(err) : resolve(res)))),
    deleteOne: (collection, filter = {}, options = {}) => collection.deleteOne(filter, options),
};

module.exports = mongodb;
