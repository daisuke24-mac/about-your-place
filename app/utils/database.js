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
            serverSelectionTimeoutMS: 5000, // 5seconds TimeOut
        });

        console.log("Success: Connected to MongoDB");
        
        cachedDb = db;
        return db;
    } catch (err) {
        console.error("Failure: Unconnected to MongoDB", err);
        throw new Error(`Failed to connect to MongoDB: ${err.message}`);
    }
};

export default connectDB
