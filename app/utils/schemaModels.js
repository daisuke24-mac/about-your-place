// app/utils/schemaModels.js

import mongoose from "mongoose"

const Schema = mongoose.Schema

const ItemSchema = new Schema({
    city: String,
    country: String,
    description: String,
})

export const ItemModel = mongoose.models.Item || mongoose.model("Item", ItemSchema)