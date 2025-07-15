const { ObjectId } = require('mongodb');

module.exports = {
  insertDocument: (db, document, collection) => {
    return db.collection(collection).insertOne(document);
  },

  findDocuments: (db, collection) => {
    return db.collection(collection).find({}).toArray();
  },

  updateDocument: (db, filter, update, collection) => {
    return db.collection(collection).updateOne(filter, { $set: update });
  }
};