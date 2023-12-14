const { MongoClient } = require('mongodb');
var database

module.exports={
    connect:()=>{
        const uri='mongodb://localhost:27017';
        const client=new MongoClient(uri);
        database=client.db('week6')
        console.log('database connected');

        },
        get:()=>{
            return database
        }
}