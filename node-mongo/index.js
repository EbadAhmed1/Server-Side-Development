/*const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations');

const url = 'mongodb://127.0.0.1:27017/';
const dbname = 'conFusion';

console.log('Starting application...');
console.log('Trying to connect to:', url);

MongoClient.connect(url, (err, client) => {
    assert.equal(err, null);
    console.log('Connected correctly to server');

    const db = client.db(dbname);

    dboper.insertDocument(db, { name: "Vadonut", description: "Test" }, 'dishes', (result) => {
        console.log('Insert Document:\n', result.ops);

        dboper.findDocuments(db, 'dishes', (docs) => {
            console.log('Found Documents:\n', docs);

            dboper.updateDocument(db, { name: 'Vadonut' }, { description: 'Updated Test' }, 'dishes', (result) => {
                console.log('Updated Document:\n', result.result);

                dboper.findDocuments(db, 'dishes', (docs) => {
                    console.log('Found Updated Documents:\n', docs);

                    db.dropCollection('dishes', (result) => {
                        console.log('Dropped Collection: ', result);
                        client.close();
                    });
                });
            });
        });
    });
});
*/

const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017/';
const dbName = 'conFusion';

async function runOperations() {
  const client = new MongoClient(url, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
    retryWrites: true,
    retryReads: true
  });

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected successfully');

    const db = client.db(dbName);
    const collection = db.collection('dishes');

    // Insert document
    const insertResult = await collection.insertOne({
      name: "Vadonut",
      description: "Test"
    });
    console.log('Inserted document:', insertResult.insertedId);

    // Find documents
    const foundDocs = await collection.find({}).toArray();
    console.log('Found documents:', foundDocs);

    // Update document
    const updateResult = await collection.updateOne(
      { name: 'Vadonut' },
      { $set: { description: 'Updated Test' } }
    );
    console.log('Updated documents:', updateResult.modifiedCount);

    // Verify update
    const updatedDocs = await collection.find({}).toArray();
    console.log('Updated documents:', updatedDocs);

    // Cleanup
    await db.dropCollection('dishes');
    console.log('Collection dropped');

  } catch (err) {
    console.error('Operation failed:', err);
  } finally {
    // Proper session cleanup
    await client.close();
    console.log('Connection closed');
  }
}

runOperations();