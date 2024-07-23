import { NextResponse } from 'next/server'
import connectDB from '../../utils/database.js'
import { ItemModel } from '../../utils/schemaModels.js'
import { getDescription } from '../../utils/gemini.js'

export async function POST(req) {
    const createItems = async (item) => {
        try {
            await ItemModel.create(item)
            return NextResponse.json({message: "successed to create item"})
        } catch (error) {
            return NextResponse.json({message: "failed to create item"})
        }
    }
    
    try {
        await connectDB()
        const body = await req.json()
        const city = body.prompt_post.address_components[body.prompt_post.address_components.length-2].long_name
        const country = body.prompt_post.address_components[body.prompt_post.address_components.length-3].long_name
        const prompt = `Describe the characteristics of ${city}, ${country} in 3 lines, focusing on its geography, history, and culture. in Japanese`
        let items = await ItemModel.find({ city: city }).maxTimeMS(15000);
        let count = items.length
        let detail = ''
        if (count === 0) {
            detail = await getDescription(prompt)
            const item = {
                "city": city,
                "country": country,
                "description": detail,
            }
            createItems(item)
        } else if (count === 1) {
            detail = items[0].description
        } else {
            items = await ItemModel.find({ city: city, country: country }).maxTimeMS(15000);
            count = items.length
            if (count === 0) {
                detail = await getDescription(prompt)
                const item = {
                    "city": city,
                    "country": country,
                    "description": detail,
                }
                createItems(item)
            } else {
                detail = items[0].description
            }
        }
        return NextResponse.json({description : detail})
    } catch (error) {
        console.error("Database operation error", error)
        return NextResponse.json({
            error: "Database operation error",
            message: error.message
         }, { status: 500 })
    }
}