import { NextResponse } from 'next/server'
import connectDB from '../../utils/database.js'
import { ItemModel } from '../../utils/schemaModels.js'
import { getDescription } from '../../utils/gemini.js'

// const getDetails = async (place) => {
//     const prompt = `Describe the characteristics of ${place} in 3 lines, focusing on its geography, history, and culture. in Japanese`
//     console.log("prompt:",prompt)
//     try {
//         const response = await fetch("/Description", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ prompt_post: prompt }),
//         })
//         const data = await response.json()
//         console.log("descrption:",data.message)
//         return data.message
//     } catch (error) {
//         console.error("Error fetching details:", error)
//         return null
//     }
// }

const createItems = async (item) => {
    // console.log(item)
    try {
        await ItemModel.create(item)
        return NextResponse.json({message: "アイテムの作成成功"})
    } catch (error) {
        return NextResponse.json({message: "アイテムの作成失敗"})
    }
}

export async function POST(req) {
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
            // detail = await getDetails(city)
            detail = await getDescription(prompt)
            // console.log("detail:",detail)
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