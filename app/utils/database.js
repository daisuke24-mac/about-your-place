// app/utils/database.js

import mongoose from "mongoose"

let cachedDb = null;

const connectDB = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'about-your-placeDataBase',
            serverSelectionTimeoutMS: 5000, // 5秒のタイムアウト
        });

        // Test the connection
        // await db.db.admin().ping();
        console.log("Success: Connected to MongoDB");
        
        cachedDb = db;
        return db;
    } catch (err) {
        console.error("Failure: Unconnected to MongoDB", err);
        throw new Error(`Failed to connect to MongoDB: ${err.message}`);
    }
};

export default connectDB

// import { MongoClient, ServerApiVersion } from 'mongodb';

// const uri = process.env.MONGODB_URI;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function connectDB() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } catch (err) {
//     console.error("Failure: Unconnected to MongoDB", err);
//     throw new Error("Failed to connect to MongoDB: " + err.message);
//   }
// }

// export default connectDB
